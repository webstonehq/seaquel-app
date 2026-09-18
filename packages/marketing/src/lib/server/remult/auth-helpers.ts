import { repo } from "remult";
import { User } from "$lib/entities/auth-entities";
import { License } from "$lib/entities/license";
import { TenantMember } from "$lib/entities/tenant-member";

export const addRolesToUser = async (emails: string[], roles: string[]) => {
  const users = await repo(User).find({
    where: {
      email: emails,
    },
  });

  const userNotFounds = emails.filter((e) => !users.some((u) => u.email === e));
  for (const nf of userNotFounds) {
    console.log(`addRolesToUser: User`, nf, "not found, roles", roles);
  }

  const usersAlreadyHaveRoles = [];
  for (const user of users) {
    const rolesToAdd = roles.filter((r) => !user.roles.includes(r));
    if (rolesToAdd.length > 0) {
      await repo(User).update(user.id, {
        roles: [...new Set([...user.roles, ...rolesToAdd])],
      });
      console.log(
        `addRolesToUser: User`,
        user.email,
        "roles added",
        rolesToAdd,
      );
    } else {
      usersAlreadyHaveRoles.push(user.email);
    }
  }

  if (usersAlreadyHaveRoles.length > 0) {
    console.log(
      `addRolesToUser: Users`,
      usersAlreadyHaveRoles,
      "already have roles",
      roles,
    );
  }
};

/**
 * Auto-link a user to what was bought or offered under their email:
 * unclaimed licenses (anonymous checkout) and pending tenant invites.
 *
 * Only for verified emails — sign-up doesn't prove email ownership, so
 * otherwise anyone could register with a buyer's address and claim
 * their licenses. Called from Better Auth's database hooks on sign-in
 * and when a user becomes verified, not per request. Best-effort: a
 * failure must not block sign-in; the user can still paste their key
 * at /dashboard/activate.
 */
export const linkByVerifiedEmail = async (userId: string) => {
  try {
    const user = await repo(User).findId(userId);
    if (!user?.email || !user.emailVerified) return;
    await claimUnlinkedLicenses(user.email, user.id);
    await acceptPendingInvites(user.email, user.id);
  } catch (err) {
    console.error("linkByVerifiedEmail: failed for user", userId, err);
  }
};

async function claimUnlinkedLicenses(email: string, userId: string): Promise<void> {
  const unlinked = await repo(License).find({
    where: { email, ownerUserId: "" },
  });
  for (const lic of unlinked) {
    await repo(License).save({ ...lic, ownerUserId: userId });
  }
}

async function acceptPendingInvites(email: string, userId: string): Promise<void> {
  const pending = await repo(TenantMember).find({
    where: { email, status: "pending" },
  });
  const now = new Date();
  for (const m of pending) {
    await repo(TenantMember).save({
      ...m,
      userId,
      status: "active",
      acceptedAt: now,
    });
  }
}
