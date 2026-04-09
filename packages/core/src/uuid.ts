/**
 * Minimal UUIDv7 generator.
 *
 * - Uses current Unix epoch milliseconds.
 * - Uses `crypto.getRandomValues` when available (browser + modern runtimes).
 * - Falls back to `Math.random` as a last resort.
 *
 * Spec reference: https://www.rfc-editor.org/rfc/rfc9562
 */

function getRandomBytes(len: number): Uint8Array {
  const a = new Uint8Array(len);

  // Browser / modern Node
  const g = globalThis as any;
  if (g?.crypto?.getRandomValues) {
    g.crypto.getRandomValues(a);
    return a;
  }

  // Last resort: not cryptographically secure.
  for (let i = 0; i < len; i++) {
    a[i] = Math.floor(Math.random() * 256);
  }
  return a;
}

function toHex(b: number): string {
  return b.toString(16).padStart(2, "0");
}

/**
 * Generate a RFC 9562 UUIDv7 string.
 */
export function uuidv7(nowMs: number = Date.now()): string {
  const bytes = getRandomBytes(16);

  // time_high (48 bits) in bytes[0..5]
  bytes[0] = (nowMs >>> 40) & 0xff;
  bytes[1] = (nowMs >>> 32) & 0xff;
  bytes[2] = (nowMs >>> 24) & 0xff;
  bytes[3] = (nowMs >>> 16) & 0xff;
  bytes[4] = (nowMs >>> 8) & 0xff;
  bytes[5] = nowMs & 0xff;

  // version (7) in high nibble of byte 6
  bytes[6] = (bytes[6] & 0x0f) | 0x70;

  // variant (RFC 4122) in byte 8
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  // Format: 8-4-4-4-12
  const hex = Array.from(bytes, toHex).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(
    12,
    16,
  )}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
