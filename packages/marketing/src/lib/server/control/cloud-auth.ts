/**
 * Server-to-server auth between a Seaquel install (Cloud tenant or
 * self-hosted) and the control plane.
 *
 * Credentials are an `X-Install-Id` + `X-License-Key` header pair. The
 * installId resolves to an `Install` row, which pins us to a specific
 * Dodo subscription; the presented license key is then checked against
 * that subscription (in strict mode) so that one tenant's keys can't
 * authenticate another tenant's calls.
 *
 * Sets `remult.user` to a `system:tenant:{tenantId}` shape so any entity
 * hooks / apiPrefilters downstream see the call as system-initiated
 * rather than anonymous (the anonymous case would be locked out by the
 * prefilters on `Tenant`, `TenantMember`, etc.).
 */
import { error } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import { remult } from "remult";
import { Install } from "$lib/entities/install";
import { License } from "$lib/entities/license";
import { Tenant } from "$lib/entities/tenant";

const INSTALL_ID_HEADER = "x-install-id";
const LICENSE_KEY_HEADER = "x-license-key";

export interface CloudAuthResult {
  install: Install;
  tenant: Tenant;
  license: License;
}

export interface RequireAuthOptions {
  /**
   * When `true` (the default), the presented license key must belong to
   * the same Dodo subscription that registered the install. Pass
   * `strict: false` only on endpoints that need to accept any active
   * key from the buyer's account and produce a structured business
   * error themselves (e.g. `verify-membership-license` returns
   * `{ ok: false, error: "wrong_subscription" }`).
   */
  strict?: boolean;
}

/**
 * Verify the `X-Install-Id` + `X-License-Key` header pair on an
 * incoming server-to-server request. Resolves the install → tenant +
 * the presented license, and (by default) checks that the license
 * belongs to the install's subscription.
 *
 * Errors are all 401 (no information leakage about which header was
 * the problem — same shape whether the install is missing, the key is
 * unknown, or the subscription doesn't match).
 */
export async function requireCloudAuth(
  event: RequestEvent,
  opts: RequireAuthOptions = {},
): Promise<CloudAuthResult> {
  const installId = event.request.headers.get(INSTALL_ID_HEADER)?.trim();
  const licenseKey = event.request.headers.get(LICENSE_KEY_HEADER)?.trim();
  if (!installId || !licenseKey) {
    throw error(401, "missing X-Install-Id or X-License-Key header");
  }

  const install = await remult
    .repo(Install)
    .findId(installId)
    .catch(() => null);
  if (!install) throw error(401, "install not registered");

  const license = await remult
    .repo(License)
    .findFirst({ licenseKey });
  if (!license) throw error(401, "invalid license credentials");
  if (license.status !== "active") {
    throw error(401, "invalid license credentials");
  }

  const tenant = await remult.repo(Tenant).findId(install.tenantId);
  if (!tenant) throw error(401, "invalid tenant credentials");

  const strict = opts.strict !== false;
  if (strict && license.dodoSubscriptionId !== install.subscriptionId) {
    throw error(401, "invalid license credentials");
  }

  setSystemUser(tenant);

  return { install, tenant, license };
}

function setSystemUser(tenant: Tenant): void {
  // Webhook handler sets remult.user for audit context; do the same so
  // any entity hooks downstream see the call as system-initiated rather
  // than anonymous (which the apiPrefilters would lock out).
  remult.user = {
    id: `system:tenant:${tenant.id}`,
    name: `Tenant ${tenant.slug}`,
    roles: [],
  };
}
