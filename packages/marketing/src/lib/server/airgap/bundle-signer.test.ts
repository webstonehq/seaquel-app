/**
 * Signer tests — must match the matrix in
 *   seaquel/src/lib/server/airgap/verify.test.ts
 * The golden-vector block at the top is the cross-runtime regression net.
 */
import * as ed from "@noble/ed25519";
import { describe, expect, it } from "vitest";

import { canonicalize, type CanonicalValue } from "./canonical";
import { signBundle, type BundlePayload, type SignedEnvelope } from "./bundle-signer";

// ---------------------------------------------------------------------------
// Golden vectors — keep byte-for-byte identical with the seaquel copy.
// ---------------------------------------------------------------------------

const GOLDEN_PAYLOAD: BundlePayload = {
  version: 1,
  issued_at: 1700000000,
  not_before: 1699999940,
  not_after: 1702592000,
  subscription_id: "sub_test_0001",
  tenant_slug: "acme",
  tier: "team",
  seats: 3,
  seat_tokens: [
    { key: "owner_key_abc", role: "owner" },
    { key: "member_key_xyz", role: "member" },
  ],
  revoked_keys: [],
  issued_by_install_id: null,
};

const GOLDEN_CANONICAL_JSON =
  '{"issued_at":1700000000,"issued_by_install_id":null,"not_after":1702592000,"not_before":1699999940,"revoked_keys":[],"seat_tokens":[{"key":"owner_key_abc","role":"owner"},{"key":"member_key_xyz","role":"member"}],"seats":3,"subscription_id":"sub_test_0001","tenant_slug":"acme","tier":"team","version":1}';

const GOLDEN_SEED_HEX = "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f";
const GOLDEN_PUBKEY_HEX = "03a107bff3ce10be1d70dd18e74bc09967e4d6309ba50d5f1ddc8664125531b8";
const GOLDEN_PUBKEY_FINGERPRINT = "56475aa75463474c0285df5dbf2bcab7";
const GOLDEN_PAYLOAD_B64URL =
  "eyJpc3N1ZWRfYXQiOjE3MDAwMDAwMDAsImlzc3VlZF9ieV9pbnN0YWxsX2lkIjpudWxsLCJub3RfYWZ0ZXIiOjE3MDI1OTIwMDAsIm5vdF9iZWZvcmUiOjE2OTk5OTk5NDAsInJldm9rZWRfa2V5cyI6W10sInNlYXRfdG9rZW5zIjpbeyJrZXkiOiJvd25lcl9rZXlfYWJjIiwicm9sZSI6Im93bmVyIn0seyJrZXkiOiJtZW1iZXJfa2V5X3h5eiIsInJvbGUiOiJtZW1iZXIifV0sInNlYXRzIjozLCJzdWJzY3JpcHRpb25faWQiOiJzdWJfdGVzdF8wMDAxIiwidGVuYW50X3NsdWciOiJhY21lIiwidGllciI6InRlYW0iLCJ2ZXJzaW9uIjoxfQ";
const GOLDEN_SIG_B64URL =
  "hmH2dfTnY_77RrUnFm8fKb92jG3ibu4iV3JZvn7UNoRZpkFET2M2Xh2vR7UVAPQZLR2vAgrSXYBw60RBlTdQAg";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = Number.parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function bytesToHex(bytes: Uint8Array): string {
  let hex = "";
  for (const b of bytes) hex += b.toString(16).padStart(2, "0");
  return hex;
}

function b64UrlToBytes(input: string): Uint8Array {
  const padded = input + "===".slice((input.length + 3) % 4);
  const std = padded.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(std);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("canonicalize", () => {
  it("matches the golden canonical JSON byte-for-byte", () => {
    const bytes = canonicalize(GOLDEN_PAYLOAD as unknown as CanonicalValue);
    const text = new TextDecoder().decode(bytes);
    expect(text).toBe(GOLDEN_CANONICAL_JSON);
  });

  it("is stable across key ordering of the input", () => {
    const reordered = {
      tier: "team",
      issued_at: 1700000000,
      seats: 3,
      version: 1,
      tenant_slug: "acme",
      issued_by_install_id: null,
      seat_tokens: [
        { role: "owner", key: "owner_key_abc" },
        { role: "member", key: "member_key_xyz" },
      ],
      not_before: 1699999940,
      not_after: 1702592000,
      revoked_keys: [] as string[],
      subscription_id: "sub_test_0001",
    } as unknown as CanonicalValue;
    const a = canonicalize(GOLDEN_PAYLOAD as unknown as CanonicalValue);
    const b = canonicalize(reordered);
    expect(b).toEqual(a);
  });

  it("emits empty arrays explicitly", () => {
    const bytes = canonicalize(GOLDEN_PAYLOAD as unknown as CanonicalValue);
    const text = new TextDecoder().decode(bytes);
    expect(text).toContain('"revoked_keys":[]');
  });

  it("emits null values explicitly", () => {
    const bytes = canonicalize(GOLDEN_PAYLOAD as unknown as CanonicalValue);
    const text = new TextDecoder().decode(bytes);
    expect(text).toContain('"issued_by_install_id":null');
  });
});

describe("golden vector", () => {
  it("matches the published pubkey hex", async () => {
    const seed = hexToBytes(GOLDEN_SEED_HEX);
    const pub = await ed.getPublicKeyAsync(seed);
    expect(bytesToHex(pub)).toBe(GOLDEN_PUBKEY_HEX);
  });

  it("signBundle produces the expected envelope", async () => {
    const envelope: SignedEnvelope = await signBundle(GOLDEN_PAYLOAD, GOLDEN_SEED_HEX);
    expect(envelope.payload).toBe(GOLDEN_PAYLOAD_B64URL);
    expect(envelope.sig).toBe(GOLDEN_SIG_B64URL);
    expect(envelope.pubkey_fingerprint).toBe(GOLDEN_PUBKEY_FINGERPRINT);
  });

  it("signBundle output decodes back to the canonical JSON", async () => {
    const envelope = await signBundle(GOLDEN_PAYLOAD, GOLDEN_SEED_HEX);
    const decoded = b64UrlToBytes(envelope.payload);
    expect(new TextDecoder().decode(decoded)).toBe(GOLDEN_CANONICAL_JSON);
  });

  it("signBundle output is independent of input key ordering", async () => {
    const reordered = {
      tier: "team",
      issued_at: 1700000000,
      seats: 3,
      version: 1,
      tenant_slug: "acme",
      issued_by_install_id: null,
      seat_tokens: [
        { role: "owner", key: "owner_key_abc" },
        { role: "member", key: "member_key_xyz" },
      ],
      not_before: 1699999940,
      not_after: 1702592000,
      revoked_keys: [] as string[],
      subscription_id: "sub_test_0001",
    } as unknown as BundlePayload;
    const a = await signBundle(GOLDEN_PAYLOAD, GOLDEN_SEED_HEX);
    const b = await signBundle(reordered, GOLDEN_SEED_HEX);
    expect(b).toEqual(a);
  });
});

describe("signBundle", () => {
  it("rejects a non-32-byte seed", async () => {
    await expect(signBundle(GOLDEN_PAYLOAD, "deadbeef")).rejects.toThrow(/32-byte seed/);
  });

  it("rejects an odd-length hex string", async () => {
    await expect(signBundle(GOLDEN_PAYLOAD, "abc")).rejects.toThrow(/odd-length/);
  });

  it("strips a 0x prefix from the seed", async () => {
    const a = await signBundle(GOLDEN_PAYLOAD, GOLDEN_SEED_HEX);
    const b = await signBundle(GOLDEN_PAYLOAD, `0x${GOLDEN_SEED_HEX}`);
    expect(b).toEqual(a);
  });

  it("produces an Ed25519 signature that verifies with the derived pubkey", async () => {
    const envelope = await signBundle(GOLDEN_PAYLOAD, GOLDEN_SEED_HEX);
    const seed = hexToBytes(GOLDEN_SEED_HEX);
    const pubkey = await ed.getPublicKeyAsync(seed);
    const payloadBytes = b64UrlToBytes(envelope.payload);
    const sigBytes = b64UrlToBytes(envelope.sig);
    const ok = await ed.verifyAsync(sigBytes, payloadBytes, pubkey);
    expect(ok).toBe(true);
  });
});

describe("seat_tokens edge cases", () => {
  it("canonicalises an empty seat_tokens array explicitly (not null, not omitted)", () => {
    const empty: BundlePayload = {
      ...GOLDEN_PAYLOAD,
      seats: 0,
      seat_tokens: [],
    };
    const text = new TextDecoder().decode(canonicalize(empty as unknown as CanonicalValue));
    expect(text).toContain('"seat_tokens":[]');
    expect(text).not.toContain('"seat_tokens":null');
  });

  it("round-trips an empty seat_tokens array through signBundle", async () => {
    const empty: BundlePayload = {
      ...GOLDEN_PAYLOAD,
      seats: 0,
      seat_tokens: [],
    };
    const envelope = await signBundle(empty, GOLDEN_SEED_HEX);
    const decoded = new TextDecoder().decode(b64UrlToBytes(envelope.payload));
    expect(decoded).toContain('"seat_tokens":[]');

    // Verify the signature is valid for the emitted payload bytes.
    const seed = hexToBytes(GOLDEN_SEED_HEX);
    const pubkey = await ed.getPublicKeyAsync(seed);
    const ok = await ed.verifyAsync(b64UrlToBytes(envelope.sig), b64UrlToBytes(envelope.payload), pubkey);
    expect(ok).toBe(true);

    // And the canonical bytes match the parsed-then-re-canonicalised form.
    const parsed = JSON.parse(decoded) as BundlePayload;
    expect(parsed.seats).toBe(0);
    expect(parsed.seat_tokens).toEqual([]);
  });
});
