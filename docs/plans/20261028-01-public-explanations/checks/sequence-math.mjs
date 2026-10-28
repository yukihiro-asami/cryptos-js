// Short arithmetic checks for the reordered explanation, using public constants only.
import assert from 'node:assert/strict';
const root = new URL('../../../../', import.meta.url);
const get = path => import(new URL(`src/${path}`, root));
const { P, L, ED25519_D: d, ED25519_BASE_X: bx, ED25519_BASE_Y: by } = await get('curve25519/const.js');
const { scalarmultCurve25519 } = await get('curve25519/x25519/scalarmult-curve25519.js');
const { scalarmultCurve25519Base } = await get('curve25519/x25519/scalarmult-curve25519-base.js');
const mod = (x, n) => (x % n + n) % n;
const pow = (x, n, p) => {
  let y = 1n;
  for (x = mod(x, p); n > 0n; n >>= 1n, x = x*x % p) if (n & 1n) y = y*x % p;
  return y;
};
const inv = x => { assert.notEqual(mod(x, P), 0n); return pow(x, P-2n, P); };
assert.equal(P, (1n<<255n)-19n);
assert.equal(L, (1n<<252n)+27742317777372353535851937790883648493n);
assert.equal(mod(5n+4n, 7n), 2n);
assert.equal(mod(2n*5n, 7n), 3n);
for (let x=1n; x<7n; x++) assert.equal(x*pow(x,5n,7n)%7n, 1n);

// Independent affine Edwards arithmetic for the explanatory identities.
const O = [0n,1n], B = [bx,by];
const onCurve = ([x,y]) => mod(-x*x+y*y-1n-d*x*x*y*y,P) === 0n;
const add = ([x,y],[u,v]) => {
  const t = mod(d*x*u*y*v,P);
  return [mod((x*v+y*u)*inv(1n+t),P), mod((y*v+x*u)*inv(1n-t),P)];
};
const mul = (n, point) => {
  let out = O;
  for (; n>0n; n>>=1n, point=add(point,point)) if (n&1n) out=add(out,point);
  return out;
};
assert.ok(onCurve(B));
assert.deepEqual(add(B,O), B);
assert.deepEqual(add(B,[mod(-bx,P),by]), O);
assert.deepEqual(mul(L,B), O);
let periodicity = 0;
for (const k of [0n,1n,2n,19n]) {
  assert.deepEqual(mul(k+L,B),mul(k,B)); periodicity++;
}
const T = [0n,P-1n], mixed = add(B,T);
assert.ok(onCurve(T) && onCurve(mixed));
assert.deepEqual(mul(2n,T),O);
assert.deepEqual(mul(L,mixed),T);
assert.notDeepEqual(mul(L,mixed),O);
assert.deepEqual(mul(8n,mixed),mul(8n,B));
assert.deepEqual(mul(L,mul(8n,mixed)),O);
assert.equal(mod(5n*by,P),4n);
assert.equal(mod((1n+by)*inv(1n-by),P),9n);

// Enumerate an illustrative 8*n additive group, not the actual curve's points.
const cosets = Array.from({length:8},(_,i)=>new Set(Array.from({length:11},(_,k)=>(i+8*k)%88)));
assert.ok(cosets.every(c=>c.size===11));
assert.equal(new Set(cosets.flatMap(c=>[...c])).size,88);

// Toy prime-order multiplicative group: algebra only, not secure parameters.
const q=23n,n=11n,g=2n;
assert.equal(pow(g,n,q),1n);
assert.equal(new Set(Array.from({length:11},(_,k)=>pow(g,BigInt(k),q))).size,11);
let schnorrIdentities=0;
for(let a=1n;a<n;a++) for(let r=0n;r<n;r++) for(let h=0n;h<n;h++) {
  const A=pow(g,a,q), R=pow(g,r,q), s=(r+h*a)%n;
  assert.equal(pow(g,s,q),R*pow(A,h,q)%q); schnorrIdentities++;
}
let edwardsIdentities=0;
for(const [a,r,h] of [[3n,4n,5n],[L-1n,1n,2n]]) {
  const A=mul(a,B), R=mul(r,B), s=(r+h*a)%L;
  assert.deepEqual(mul(s,B),add(R,mul(h,A))); edwardsIdentities++;
}
const bytes = n => Uint8Array.from({length:32},(_,i)=>Number((n>>BigInt(8*i))&255n));
const u9=bytes(9n);
const publicTestScalars=[3n,123456789n];
for (const scalar of publicTestScalars) {
  assert.equal(scalarmultCurve25519Base(scalar),scalarmultCurve25519(bytes(scalar),u9));
}
const [a,b]=publicTestScalars, ua=scalarmultCurve25519Base(a), ub=scalarmultCurve25519Base(b);
assert.equal(scalarmultCurve25519(bytes(a),bytes(ub)),scalarmultCurve25519(bytes(b),bytes(ua)));
console.log(JSON.stringify({passed:true,fieldExamples:2,fieldInverses:6,basePointOrderIdentity:1,basePointPeriodicity:periodicity,mixedOrderPointAndCofactor:'passed',cosetIllustration:{groupSize:88,sets:8,sizeEach:11},actualCurvePointCount:'from RFC 7748; not enumerated',schnorrIdentities,edwardsSignatureIdentities:edwardsIdentities,basePointConversion:1,x25519BasePaths:2,x25519Agreement:1},null,2));
