import { ge25519IsCanonical } from '../../../../src/curve25519/ge25519/ge25519-is-canonical.js';

// helper: Uint8Array from hex
function hexToBytes(hex) {
    return new Uint8Array(hex.match(/.{1,2}/g).map(b => parseInt(b, 16)));
}

// === Test Vectors ===
// Canonical y-coordinate (all zeros except last byte masked)
const canonical = hexToBytes(
    '000000000000000000000000000000000000000000000000000000000000007f'
);

// Non-canonical (exceeds valid y-coordinate representation)
const nonCanonical = hexToBytes(
    'edffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
);

// === Test Execution ===
const results = [];
results.push(ge25519IsCanonical(canonical) === 1 ? 'pass' : 'fail');
results.push(ge25519IsCanonical(nonCanonical) === 0 ? 'pass' : 'fail');

// Final output
if (results.every(r => r === 'pass')) {
    console.log('tests_passed.');
} else {
    console.log('tests_failed.');
}
