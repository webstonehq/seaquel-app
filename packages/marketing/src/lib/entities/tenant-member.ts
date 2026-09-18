import {
  Allow,
  BackendMethod,
  Entity,
  Fields,
  Relations,
  Validators,
  remult,
} from "remult";
import { Tenant } from "./tenant";
import { License } from "./license";
import { User } from "./auth-entities";

export interface InviteMemberInput {
  tenantId: string;
  email: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Seat occupancy for a tenant. One row per (tenant, person):
 *
 *   - The owner row is inserted automatically when the tenant is
 *     provisioned. `userId = ownerUserId`, `role = "owner"`,
 *     `status = "active"`.
 *   - Invites are created by the owner from /dashboard/[slug]/members:
 *     `email` set, `userId = ""`, `status = "pending"`.
 *   - When a user with a verified matching email signs in,
 *     `linkByVerifiedEmail` flips pending rows to `status = "active"`
 *     and fills in `userId`.
 *
 * Seat quota: `count(active + pending) <= License.seats`. Removed rows
 * (`status = "removed"`) free a slot but stay around for audit.
 *
 * Access control is structural: the Remult prefilter scopes reads to
 * tenants the caller owns or is an active member of. Invite writes go
 * through the `TenantMember.invite` BackendMethod below so owner-check,
 * seat-quota, and dup-collapse logic always runs. Removal is NOT
 * exposed here — it lives in each tenant's container at
 * `DELETE /api/team/[containerUserId]` so the local Better Auth
 * user/session/member_license rows are torn down atomically with the
 * upstream soft-remove (which goes through `/api/cloud/unbind-member`).
 * Removing from the dashboard alone would leave the user with a live
 * session and no way for the container to learn about the revocation.
 */
@Entity<TenantMember>("tenant_members", {
  allowApiRead: Allow.authenticated,
  allowApiInsert: false,
  allowApiUpdate: false,
  allowApiDelete: false,
  apiPrefilter: async () => {
    const userId = remult.user?.id;
    // No session → return a filter that can't match anything. An empty
    // object here would match all rows, which is the opposite of what
    // we want.
    if (!userId) return { id: "__none__" };
    const ownedTenants = await remult
      .repo(Tenant)
      .find({ where: { ownerUserId: userId } });
    const memberRows = await remult
      .repo(TenantMember)
      .find({ where: { userId, status: "active" } });
    const tenantIds = Array.from(
      new Set([
        ...ownedTenants.map((t) => t.id),
        ...memberRows.map((m) => m.tenantId),
      ]),
    );
    // Same "no-match" pattern when the user has no tenants at all.
    if (tenantIds.length === 0) return { id: "__none__" };
    return { tenantId: tenantIds };
  },
})
export class TenantMember {
  @Fields.id({ allowApiUpdate: false })
  id!: string;

  @Fields.string({ required: true, allowApiUpdate: false })
  tenantId = "";
  @Relations.toOne<TenantMember, Tenant>(() => Tenant, "tenantId")
  tenant!: Tenant;

  /**
   * Better Auth user id. Empty until an invitee with this `email` signs
   * in with that email verified — `linkByVerifiedEmail` then claims
   * pending rows for them.
   */
  @Fields.string({ required: false })
  userId = "";
  @Relations.toOne<TenantMember, User>(() => User, "userId")
  user!: User;

  /** Email the owner invited. Always set; matched against signups. */
  @Fields.string({
    required: true,
    validate: Validators.email(),
  })
  email = "";

  @Fields.string({
    required: true,
    validate: (_r, f) =>
      ["owner", "member"].includes(f.value) || "invalid role",
  })
  role = "member";

  @Fields.string({
    required: true,
    validate: (_r, f) =>
      ["pending", "active", "removed"].includes(f.value) || "invalid status",
  })
  status = "pending";

  @Fields.createdAt({ allowApiUpdate: false })
  invitedAt!: Date;

  @Fields.date({ required: false })
  acceptedAt?: Date;

  /**
   * License key the member used to join. Empty for legacy email-invite
   * rows pre-dating the license-key signup flow. Indexed so the
   * control plane can answer "is this license already bound to
   * another tenant?" in one query, and so `subscription.cancelled`
   * webhooks can find affected memberships.
   */
  @Fields.string({ required: false })
  licenseKey = "";

  /**
   * Better Auth user id INSIDE the per-tenant container. Distinct from
   * `userId` (which references the control-plane Better Auth user on
   * seaquel.app, used for the dashboard). Filled by `/api/cloud/bind-member`
   * after the container creates its local user.
   */
  @Fields.string({ required: false })
  containerUserId = "";

  /**
   * When the member was bound to a license (i.e. when the container
   * called `bind-member`). Distinct from `acceptedAt` (which the legacy
   * invite flow set on auth claim) — `boundAt` is the timestamp the
   * license was attached to this row.
   */
  @Fields.date({ required: false })
  boundAt?: Date;

  /**
   * Invite a teammate to a tenant. Owner-only. Enforces seat quota
   * (`active + pending <= License.seats`) so an owner can't spam invites
   * past what the plan allows. Pending invites for the same email
   * collapse — existing `removed` rows revive to `pending` rather than
   * creating a duplicate row.
   */
  @BackendMethod({ allowed: Allow.authenticated })
  static async invite(input: InviteMemberInput): Promise<TenantMember> {
    const userId = remult.user?.id;
    if (!userId) throw "unauthorized";

    const email = input.email.trim().toLowerCase();
    if (!email) throw "email is required";
    if (!EMAIL_RE.test(email)) throw "invalid email";

    const tenant = await remult.repo(Tenant).findId(input.tenantId);
    if (!tenant || tenant.ownerUserId !== userId) throw "tenant not found";

    const license = await remult.repo(License).findId(tenant.licenseId);
    if (!license) throw "tenant has no backing license";

    const occupied = await remult.repo(TenantMember).count({
      tenantId: tenant.id,
      status: ["active", "pending"],
    });
    if (occupied >= license.seats) {
      throw `seat quota reached (${license.seats}/${license.seats})`;
    }

    const existing = await remult
      .repo(TenantMember)
      .findFirst({ tenantId: tenant.id, email });
    if (existing) {
      if (existing.status !== "removed") throw "already invited";
      return remult.repo(TenantMember).save({
        ...existing,
        status: "pending",
        invitedAt: new Date(),
        acceptedAt: undefined,
      });
    }

    return remult.repo(TenantMember).insert({
      tenantId: tenant.id,
      email,
      role: "member",
      status: "pending",
    });
  }
}
