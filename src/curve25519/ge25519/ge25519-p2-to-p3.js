import { fe25519Mul } from '../fe25519/fe25519-mul.js';
import { fe25519Copy } from '../fe25519/fe25519-copy.js';

export function ge25519P2ToP3(r, p) {
    fe25519Copy(r.X, p.X);
    fe25519Copy(r.Y, p.Y);
    fe25519Copy(r.Z, p.Z);
    fe25519Mul(r.T, p.X, p.Y);
}
