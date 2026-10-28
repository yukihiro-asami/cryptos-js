// Example helpers; these do not change the library's low-level API.
export function fromHex(hex) {
  if (!/^(?:[0-9a-f]{2})*$/i.test(hex)) {
    throw new Error('Expected complete hexadecimal bytes');
  }
  return Uint8Array.from(hex.match(/../g) ?? [], pair => Number.parseInt(pair, 16));
}

export function toHex(bytes) {
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function fromLE(bytes) {
  return bytes.reduceRight((n, byte) => (n << 8n) | BigInt(byte), 0n);
}

export function toLE32(value) {
  return Uint8Array.from({ length: 32 }, (_, i) => Number((value >> BigInt(i * 8)) & 255n));
}

export function check(condition, label) {
  if (!condition) {
    throw new Error('Check failed: ' + label);
  }
  return label;
}

export function equalBytes(actual, expected, label) {
  return check(toHex(actual) === toHex(expected), label);
}
