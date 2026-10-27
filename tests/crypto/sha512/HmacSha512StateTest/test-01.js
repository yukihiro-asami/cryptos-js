import { hmacSha512State } from '../../../../src/crypto/sha512/hmac-sha512-state.js';

let allPassed = true;

const state = hmacSha512State();

// === ictx の検証 ===
if (typeof state.ictx !== 'object') {
    console.assert(false, 'FAILED: ictx is not an object');
    allPassed = false;
} else {
    const ictx = state.ictx;

    if (!Array.isArray(ictx.state) || ictx.state.length !== 8) {
        console.assert(false, 'FAILED: ictx.state is not an array of length 8');
        allPassed = false;
    } else {
        for (let i = 0; i < 8; i++) {
            const entry = ictx.state[i];
            if (typeof entry !== 'object' || typeof entry.value !== 'bigint' || entry.value !== 0n) {
                console.assert(false,
                    `FAILED: ictx.state[${i}] is not { value: 0n }`);
                allPassed = false;
            }
        }
    }

    if (typeof ictx.count !== 'bigint' || ictx.count !== 0n) {
        console.assert(false, 'FAILED: ictx.count !== 0n');
        allPassed = false;
    }

    if (!(ictx.buf instanceof Uint8Array) || ictx.buf.length !== 128) {
        console.assert(false, 'FAILED: ictx.buf is not Uint8Array(128)');
        allPassed = false;
    } else {
        for (let i = 0; i < 128; i++) {
            if (ictx.buf[i] !== 0) {
                console.assert(false, `FAILED: ictx.buf[${i}] !== 0`);
                allPassed = false;
                break;
            }
        }
    }
}

// === octx の検証 ===
if (typeof state.octx !== 'object') {
    console.assert(false, 'FAILED: octx is not an object');
    allPassed = false;
} else {
    const octx = state.octx;

    if (!Array.isArray(octx.state) || octx.state.length !== 8) {
        console.assert(false, 'FAILED: octx.state is not an array of length 8');
        allPassed = false;
    } else {
        for (let i = 0; i < 8; i++) {
            const entry = octx.state[i];
            if (typeof entry !== 'object' || typeof entry.value !== 'bigint' || entry.value !== 0n) {
                console.assert(false,
                    `FAILED: octx.state[${i}] is not { value: 0n }`);
                allPassed = false;
            }
        }
    }

    if (typeof octx.count !== 'bigint' || octx.count !== 0n) {
        console.assert(false, 'FAILED: octx.count !== 0n');
        allPassed = false;
    }

    if (!(octx.buf instanceof Uint8Array) || octx.buf.length !== 128) {
        console.assert(false, 'FAILED: octx.buf is not Uint8Array(128)');
        allPassed = false;
    } else {
        for (let i = 0; i < 128; i++) {
            if (octx.buf[i] !== 0) {
                console.assert(false, `FAILED: octx.buf[${i}] !== 0`);
                allPassed = false;
                break;
            }
        }
    }
}

if (allPassed) {
    console.log('tests_passed.');
}
