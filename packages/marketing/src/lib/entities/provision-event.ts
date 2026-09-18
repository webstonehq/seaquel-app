import { Entity, Fields } from "remult";

/**
 * Audit trail for provisioning orchestration. Read by operators when a
 * tenant gets stuck in `provisioning` or `deleting` — the `detail` JSON
 * captures platform responses, timestamps, and error bodies.
 *
 * Never shown to end users. No PII beyond the tenantId.
 */
@Entity<ProvisionEvent>("provision_events", {
  // Server-only — the dashboard reads the latest event via
  // /api/control/tenants/[id]/status, which checks ownership.
  allowApiCrud: false,
})
export class ProvisionEvent {
  @Fields.id({ allowApiUpdate: false })
  id!: string;

  @Fields.string({ required: true, allowApiUpdate: false })
  tenantId = "";

  /**
   * Named lifecycle step. Kept as a free-form string rather than an enum
   * so new steps (e.g. `tls_cert_issued`, `health_passed`) can be added
   * without a migration.
   */
  @Fields.string({ required: true, allowApiUpdate: false })
  event = "";

  @Fields.json()
  detail: Record<string, unknown> = {};

  @Fields.createdAt({ allowApiUpdate: false })
  at!: Date;
}
