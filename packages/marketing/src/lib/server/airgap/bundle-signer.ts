/**
 * Signer for air-gapped license bundles. The control plane calls this when a
 * tenant downloads / refreshes their bundle for an air-gapped Seaquel install.
 * The self-hosted side verifies envelopes produced here using
 *   seaquel/src/lib/server/airgap/verify.ts
 *
 * Runs in both Node (build / scripts) and Cloudflare Workers (production).
 * `@noble/ed25519` v2 ships pure JS with no native bindings.
 *
 * IMPORTANT: keep `types.ts` and `canonical.ts` in sync with the seaquel
 * verifier copies. The two repos share no package — golden-vector tests on
 * both sides pin byte-for-byte canonicalisation and signature output.
 */
import * as ed from "@noble/ed25519";

import { canonicalize, fingerprintPubkey, type CanonicalValue } from "./canonical";
import type { BundlePayload, SignedEnvelope } from "./types";

export type { BundlePayload, SignedEnvelope } from "./types";
export { canonicalize, fingerprintPubkey } from "./canonical";

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  const b64 = btoa(binary);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  if (clean.length % 2 !== 0) {
    throw new Error(`bundle-signer: odd-length hex string`);
  }
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) {
    const byte = Number.parseInt(clean.slice(i * 2, i * 2 + 2), 16);
    if (Number.isNaN(byte)) throw new Error(`bundle-signer: invalid hex char`);
    out[i] = byte;
  }
  return out;
}

/**
 * Sign `payload` with `privateKeyHex` (a 32-byte Ed25519 seed in hex, with or
 * without `0x` prefix). Returns the envelope structure that the verifier
 * consumes.
 */
export async function signBundle(payload: BundlePayload, privateKeyHex: string): Promise<SignedEnvelope> {
  const seed = hexToBytes(privateKeyHex);
  if (seed.length !== 32) {
    throw new Error(`bundle-signer: expected 32-byte seed, got ${seed.length}`);
  }
  const pubkey = await ed.getPublicKeyAsync(seed);
  const canonical = canonicalize(payload as unknown as CanonicalValue);
  const sig = await ed.signAsync(canonical, seed);
  const fingerprint = await fingerprintPubkey(pubkey);
  return {
    payload: base64UrlEncode(canonical),
    sig: base64UrlEncode(sig),
    pubkey_fingerprint: fingerprint,
  };
}
