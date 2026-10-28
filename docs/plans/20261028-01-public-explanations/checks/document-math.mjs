import assert from 'node:assert/strict';
const root = new URL('../../../../', import.meta.url);
const get = path => import(new URL(`src/${path}`, root));
const { P, L, MASK_255 } = await get('curve25519/const.js');
const { fe25519Mul } = await get('curve25519/fe25519/fe25519-mul.js');
const { fe25519Sq } = await get('curve25519/fe25519/fe25519-sq.js');
const { fe25519Invert } = await get('curve25519/fe25519/fe25519-invert.js');
const { ge25519FromBytes } = await get('curve25519/ge25519/ge25519-from-bytes.js');
const { ge25519P3 } = await get('curve25519/ge25519/ge25519-p3.js');
const { ge25519P1p1ToP3 } = await get('curve25519/ge25519/ge25519-p1p1-to-p3.js');
const { ge25519P3ToBytes } = await get('curve25519/ge25519/ge25519-p3-to-bytes.js');
const { scalarToRadix16 } = await get('curve25519/ge25519/scalar-to-radix16.js');
const mod = x => ((x % P) + P) % P;
const fold = x => (x & MASK_255) + 19n * (x >> 255n);
const B = 1n << 255n;
const values = [-B*B, -B-1n, -P, -1n, 0n, 1n, 19n, P-1n, P, B+7n, B*B-1n];
for (const x of values) {
  const lo=x&MASK_255, hi=x>>255n;
  assert.equal(x,lo+hi*B);
  assert.ok(lo>=0n && lo<B);
  assert.equal(mod(fold(x)),mod(x));
  const out={value:0n};fe25519Sq(out,{value:x});
  assert.equal(mod(out.value),mod(x*x));
  for(const y of values) {
    fe25519Mul(out,{value:x},{value:y});
    assert.equal(mod(out.value),mod(x*y));
  }
}
assert.equal(fold(B+7n),26n);
assert.equal(fold(-1n),P-1n);
let bounds=0;
for(const x of [0n,1n,19n,P-1n]) for(const y of [0n,1n,19n,P-1n]) {
  const f=fold(x*y);assert.ok(f>=0n && f<20n*B);
  assert.ok(fold(f)<B+361n);bounds++;
}
for(const A of values) for(const C of values) {
  const AA=A*A,BB=C*C,E=AA-BB;
  assert.equal(E*(BB+121666n*E),E*(AA+121665n*E));
}
const encoded=Uint8Array.from(Buffer.from('58'+'66'.repeat(31),'hex'));
const point=ge25519P3();assert.equal(ge25519FromBytes(point,encoded),0);
const x=mod(point.X.value),y=mod(point.Y.value);
const completed={X:{value:x*7n},Y:{value:y*11n},Z:{value:7n},T:{value:11n}};
const extended=ge25519P3();ge25519P1p1ToP3(extended,completed);
assert.equal(mod(extended.X.value*extended.Y.value),mod(extended.Z.value*extended.T.value));
const output=new Uint8Array(32);ge25519P3ToBytes(output,extended);assert.deepEqual(output,encoded);
for(const z of [1n,2n,7n,19n,P-1n]) {
  const out={value:0n};fe25519Invert(out,{value:z});assert.equal(mod(z*out.value),1n);
}
for(const n of [0n,1n,15n,16n,L-1n]) {
  const digits=scalarToRadix16({value:n});let recovered=0n;
  for(let i=0;i<digits.length;i++)recovered+=BigInt(digits[i])*(16n**BigInt(i));
  assert.equal(recovered,n);
}
console.log(JSON.stringify({foldInputs:values.length,multiplications:values.length**2,squares:values.length,rangeChecks:bounds,ladderIdentities:values.length**2,completedToExtended:1,inverses:5,radix16Reconstructions:5,passed:true}));
