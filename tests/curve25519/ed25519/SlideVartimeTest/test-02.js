import { slideVartime } from '../../../../src/curve25519/ed25519/slide-vartime.js';

// --- ヘルパー関数 ---

function hexToUint8ArrayLE(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    }
    return bytes;
}

function bytesToBigIntLE(bytes) {
    let result = 0n;
    for (let i = bytes.length - 1; i >= 0; i--) {
        result = (result << 8n) | BigInt(bytes[i]);
    }
    return result;
}

function slidingWindowToBigInt(r) {
    let result = 0n;
    for (let i = 0; i < 256; i++) {
        if (r[i] !== 0) {
            result += BigInt(r[i]) << BigInt(i);
        }
    }
    return result;
}

// --- テスト実行関数 ---

function runSlideTest(name, inputHex) {
    const aBytes = hexToUint8ArrayLE(inputHex);
    const aBigInt = bytesToBigIntLE(aBytes);

    const r = new Int8Array(256);
    slideVartime(r, aBytes);

    const reconstructed = slidingWindowToBigInt(r);

    if (aBigInt !== reconstructed) {
        console.error(`${name} failed.`);
        console.error(`Expected:      ${aBigInt}`);
        console.error(`Reconstructed: ${reconstructed}`);
        process.exit(1);
    }
}

// --- テストケース ---

const tests = [
    {
        name: "bit 0 = 1",
        inputHex: "01" + "00".repeat(31),
    },
    {
        name: "bits 0–2 = 1",
        inputHex: "07" + "00".repeat(31),
    },
    {
        name: "bits 0–5 = 1",
        inputHex: "3f" + "00".repeat(31),
    },
    {
        name: "bit 255 = 1",
        inputHex: "00".repeat(31) + "80",
    },
    {
        name: "all bits = 1 (2^255 - 1)",
        inputHex: "ff".repeat(31) + "7f",
    },
    {
        name: "only bit 1 = 1",
        inputHex: "02" + "00".repeat(31),
    },
    {
        name: "bits 1,3,5 = 1",
        inputHex: "2a" + "00".repeat(31), // 00101010b
    },
    {
        name: "bit 250 = 1",
        inputHex: "00".repeat(31) + "04", // bit 250 = (250 % 8 = 2) ⇒ 0b00000100
    },
    {
        name: "bit 254 = 1",
        inputHex: "00".repeat(31) + "40", // bit 254 = 0b01000000
    },
    {
        name: "bits 253–255 = 1",
        inputHex: "00".repeat(31) + "e0", // 0b11100000 = bits 253,254,255
    },
    {
        name: "bit 0 and 255 = 1",
        inputHex: "01" + "00".repeat(30) + "80", // bit 0 and bit 255
    },
];

// --- テスト実行 ---

for (const test of tests) {
    runSlideTest(test.name, test.inputHex);
}

console.log('tests_passed.');
