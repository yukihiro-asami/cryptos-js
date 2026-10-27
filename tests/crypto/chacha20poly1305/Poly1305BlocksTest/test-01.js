import { poly1305Blocks } from '../../../../src/crypto/chacha20poly1305/poly1305-blocks.js';

// 適当な初期状態
const state = {
    r: 0xabcdef1234567890n, // 適当な r
    h: 0x1234567890abcdefn  // 初期 h
};

const initialH = state.h;

// テスト用の16バイト入力（1ブロック）
const m = new Uint8Array(16);
m[0] = 1; // 適当に 1 を入れておく

poly1305Blocks(state, m);

if (state.h !== initialH) {
    console.log("test passed.");
}