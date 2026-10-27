import { chachaCtx } from '../../../../src/crypto/chacha20poly1305/chacha-ctx.js';

let allPassed = true;

const ctx = chachaCtx();
const caseLabel = 'chachaCtx() structure and zero-init';

// テスト1: inputプロパティが存在し、Uint32Arrayであること
if (!(ctx.input instanceof Uint32Array)) {
    console.assert(false, `${caseLabel} failed: input is not Uint32Array`);
    allPassed = false;
}

// テスト2: inputの長さが16であること
if (ctx.input.length !== 16) {
    console.assert(false, `${caseLabel} failed: input.length is ${ctx.input.length}, expected 16`);
    allPassed = false;
}

// テスト3: inputのすべての要素が0で初期化されていること
for (let i = 0; i < 16; i++) {
    if (ctx.input[i] !== 0) {
        console.assert(false, `${caseLabel} failed: input[${i}] is ${ctx.input[i]}, expected 0`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
