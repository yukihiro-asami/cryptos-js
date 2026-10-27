import { ge25519P3ToP2 } from '../../../../src/curve25519/ge25519/ge25519-p3-to-p2.js';
import { ge25519P2 } from '../../../../src/curve25519/ge25519/ge25519-p2.js';
import { ge25519P3 } from '../../../../src/curve25519/ge25519/ge25519-p3.js';

let allPassed = true;

// フェイクP3点を作成
const p = ge25519P3();
p.X.value = 123n;
p.Y.value = 456n;
p.Z.value = 789n;
p.T.value = 999n; // 無視されることを確認したい

// 出力先P2点を作成
const r = ge25519P2();
ge25519P3ToP2(r, p);

// 検証
if (r.X.value !== p.X.value) {
    console.assert(false, `X mismatch: expected ${p.X.value}, got ${r.X.value}`);
    allPassed = false;
}
if (r.Y.value !== p.Y.value) {
    console.assert(false, `Y mismatch: expected ${p.Y.value}, got ${r.Y.value}`);
    allPassed = false;
}
if (r.Z.value !== p.Z.value) {
    console.assert(false, `Z mismatch: expected ${p.Z.value}, got ${r.Z.value}`);
    allPassed = false;
}

// Tが無視されたことは、この関数では明示的にチェック不要（設計通り）

if (allPassed) {
    console.log('tests_passed.');
}
