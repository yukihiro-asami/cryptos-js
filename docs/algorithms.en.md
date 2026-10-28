# From equations to code: cryptographic algorithms in cryptos-js

[日本語](algorithms.md) · [README](../README.en.md) · [BigInt field arithmetic](bigint-field-arithmetic.en.md)

cryptos-js implements five cryptographic building blocks in vanilla JavaScript. This guide follows the points, integers, and byte strings in the mathematics into the functions that compute them. Field arithmetic, signatures, hashing, key derivation, and authenticated encryption can all be read down to their internals in one repository.

## 1. The five building blocks

| Component | What it computes | Entry points |
|---|---|---|
| X25519 | A shared secret from a local scalar and a peer's public value | [scalarmult-curve25519.js](../src/curve25519/x25519/scalarmult-curve25519.js) |
| Ed25519 | A key pair from a seed, signatures from a secret key and message, verification with a public key | [key-pair.js](../src/curve25519/ed25519/key-pair.js), [sign-detached.js](../src/curve25519/ed25519/sign-detached.js), [verify-detached.js](../src/curve25519/ed25519/verify-detached.js) |
| SHA-512 | A 64-byte message digest | [sha512.js](../src/crypto/sha512/sha512.js) |
| HKDF-SHA-512 | Key material of a requested length from input key material and context | [hkdf-sha512-extract.js](../src/crypto/sha512/hkdf-sha512-extract.js), [hkdf-sha512-expand.js](../src/crypto/sha512/hkdf-sha512-expand.js) |
| ChaCha20-Poly1305 | Ciphertext and an authentication tag from a key, nonce, plaintext, and AAD | [chacha20poly1305-encrypt.js](../src/crypto/chacha20poly1305/chacha20poly1305-encrypt.js), [chacha20poly1305-decrypt.js](../src/crypto/chacha20poly1305/chacha20poly1305-decrypt.js) |

One possible composition feeds an X25519 shared secret into HKDF, then uses a derived key with ChaCha20-Poly1305. Ed25519 provides signatures. This guide describes the computations of these components; it does not define a communication or authentication protocol that combines them.

Read in this order: **learn finite fields and point operations through X25519 → understand Schnorr signatures through integer exponentiation → connect the structure to Ed25519 equations and code**. Coordinate representations, BigInt, hashing, and other internals follow.

## 2. X25519: from finite fields and point operations to key agreement

### A finite field supplies the coordinates and their arithmetic

A **field** supports addition, subtraction, multiplication, and division by every nonzero element within the set, with laws such as commutativity, associativity, and distributivity. A **finite field** has finitely many elements. For example, arithmetic in the field with prime modulus 7 gives:

$$
5+4\equiv2\pmod7,\qquad 2\times5\equiv3\pmod7
$$

The second relation means that `3 / 2` is 5 in this field. A prime modulus gives every nonzero element a multiplicative inverse. The modulus specifies which integer remainders represent the values.

X25519 coordinate arithmetic uses this field:

$$
p=2^{255}-19,\qquad \mathbb F_p=\{0,1,\ldots,p-1\}
$$

The field consists of this set with arithmetic modulo p. Each coordinate u or v is a field element; (u,v) is a coordinate pair. Pairs satisfying the following Montgomery equation are points on the curve:

$$
v^2\equiv u^3+486662u^2+u\pmod p
$$

Addition and multiplication inside the equation are field operations. [Langley, Hamburg, and Turner, RFC 7748 §4.1](https://www.rfc-editor.org/rfc/rfc7748.html#section-4.1)

### Point addition, identity, scalar multiplication, and order

The curve has a **point-addition** law, rather than componentwise addition of coordinates. Its points form an abelian group under this operation. A group is closed under its operation, has associativity and an identity, and provides an inverse for each element. Here, commutativity `P + Q = Q + P` makes it an **abelian group**.

The identity O satisfies `P + O = P`. In the Montgomery model, it is the point at infinity added to the ordinary (u,v) points. The inverse of P is −P, with `P + (−P) = O`. These play the roles of zero and negation in ordinary addition.

Adding the base point B to itself k times is **scalar multiplication**, written `[k]B`. In this explanation, uppercase B, A, C, and similar symbols denote points; lowercase a, b, k, and similar symbols denote scalars. Letter case does not distinguish public from secret values.

$$
[k]B=\underbrace{B+B+\cdots+B}_{k\text{ times}},\qquad [0]B=\mathcal O
$$

A point's order is the smallest positive number of additions that returns to the identity. The X25519 base point has u-coordinate 9 and this prime order:

$$
\ell=2^{252}+27742317777372353535851937790883648493,\qquad [\ell]B=\mathcal O
$$

Consequently, `[k + ℓ]B = [k]B`. Replacing k with its remainder modulo ℓ, between 0 and ℓ−1, leaves the resulting point unchanged. It does not mean that a scalar automatically falls in that range.

| Object being computed | Modulus | Meaning |
|---|---|---|
| Point coordinates | p | Defines the field containing coordinate values |
| How many times to add B | ℓ | Reduces the scalar by the period of repeated addition |

The value p alone does not determine ℓ; the field, curve equation, and chosen point determine the order. Since ℓ is prime, scalars also admit field arithmetic, but **the set of curve points is not that field**. The distinction appears as `P` and `L` in [const.js](../src/curve25519/const.js), and in the separate [fe25519](../src/curve25519/fe25519/fe25519-reduce.js) and [sc25519](../src/curve25519/sc25519/sc25519-reduce.js) operations.

### 8ℓ points on the curve, ℓ in the base point's subgroup

Write `E(Fp)` for all curve points, including the identity. This curve has 8ℓ such points. Repeatedly adding B instead generates these ℓ points:

$$
H=\{\mathcal O,B,[2]B,\ldots,[\ell-1]B\},\qquad |E(\mathbb F_p)|=8\ell,\quad |H|=\ell
$$

Adding points in H, or taking their inverses, stays within H:

$$
[i]B+[j]B=[(i+j)\bmod\ell]B,\qquad -[i]B=[(-i)\bmod\ell]B
$$

Thus H is itself a group: a **subgroup** of the full curve group. The ratio between their sizes is 8, called the **cofactor**.

Starting at a point P and repeatedly adding B visits the ℓ points in `P + H = {P + Q : Q ∈ H}`. The full curve group splits into eight disjoint sets of this form. The set containing the identity is H. The others are translates of H, not eight separate subgroups. Integer multiples of B therefore do not visit every curve point.

Reducing scalars modulo ℓ applies to points in H; `[ℓ]P = O` need not hold for an arbitrary curve point P. Multiplying any such P by 8 does put it in H:

$$
[\ell]([8]P)=[8\ell]P=\mathcal O
$$

This is the background of the factor 8 in Ed25519 verification later in the guide. The Montgomery model and the Edwards model introduced below have the same order and cofactor relationship. [RFC 7748 §4.1](https://www.rfc-editor.org/rfc/rfc7748.html#section-4.1)

### Two parties obtain the same shared secret

In this large prime-order subgroup, computing `A = [a]B` from a is easy, while recovering a from A is considered computationally difficult: the discrete logarithm problem. Two parties choose secret scalars a and b and exchange public points A and C:

$$
A=[a]B,\qquad C=[b]B,\qquad [a]C=[b]A=[ab]B
$$

Multiplying the peer's public point by one's own secret scalar gives the same point on both sides, without exchanging the secret scalars themselves.

X25519 uses the u-coordinate rather than transmitting a whole point. For scalars a and b after input adjustment, the public values and shared secret have this relationship:

$$
u_A=\operatorname{X25519}(a,9),\quad u_C=\operatorname{X25519}(b,9),\quad
z=\operatorname{X25519}(a,u_C)=\operatorname{X25519}(b,u_A)
$$

The actual function takes byte strings. [scalarmultCurve25519](../src/curve25519/x25519/scalarmult-curve25519.js) clears the scalar's lowest three bits and its highest bit, then sets the next-highest bit. It returns the u-coordinate as a BigInt. Conversion to 32 little-endian bytes appears in the [interoperability tests](../tests/interop.test.mjs). Deriving an application key from the shared secret is outside this function. [RFC 7748 §5 and §6.1](https://www.rfc-editor.org/rfc/rfc7748.html#section-5)

### Two computation paths in this implementation

For a peer's public value, `scalarmultCurve25519` uses the [Montgomery ladder](../src/curve25519/x25519/montgomery-ladder.js). It retains two projective points, reads 255 scalar bits from high to low, and combines swaps, differential addition, and doubling. It normalizes coordinates after each iteration and recovers u by inversion at the end.

The [base-point function](../src/curve25519/x25519/scalarmult-curve25519-base.js) instead adjusts a BigInt input, reduces it modulo ℓ, and uses fixed-base multiplication in Edwards coordinates. It then calls [edwardsToMontgomery](../src/curve25519/x25519/edwards-to-montgomery.js) to compute `u = (1+y)/(1−y)`. The base point's y-coordinate is 4/5, giving u=9. This path reuses the existing fixed-base multiplication rather than passing u=9 directly to the ladder.

The ladder's `MONTGOMERY_A24 = 121666` and the RFC's `121665` correspond through the whole formula. With `E = AA − BB`:

$$
E(BB+121666E)=E(AA+121665E)
$$

The code uses the left-hand side and the RFC pseudocode the right-hand side. A ladder structure alone does not guarantee constant-time execution of BigInt swaps and arithmetic.

## 3. Schnorr signatures: understanding the structure through exponentiation

### One-way computation with a compatible arithmetic structure

Temporarily set aside curve arithmetic and consider one-way computation through integer exponentiation. Choose a separate prime q, a prime n dividing q−1, and a public element g of order n under multiplication modulo q. Here q is the modulus for values, and n is the period of exponents. These roles resemble p and ℓ above, but the values are different.

$$
f(a)=g^a\bmod q,\qquad g^n\equiv1\pmod q
$$

With suitable sizes and a suitable group, evaluating f(a) is easy and reversing it is difficult. Schnorr signatures also use this relationship:

$$
f(a+b)\equiv f(a)f(b)\pmod q
$$

Addition of exponents corresponds to multiplication of public values. This is what makes a computation involving secrets checkable using public information. The function supplies this arithmetic structure as well as one-wayness.

### Secret and public values

In this section, A and R are elements of an integer multiplicative group. In Ed25519 below, curve points take those roles. Let m be the message byte string.

| Symbol | Role | Public or secret |
|---|---|---|
| g | A specified generator of the subgroup of order n | Public constant |
| a | The signer's secret scalar | Secret |
| A | The public key `g^a mod q` | Public |
| r | An ephemeral secret scalar used for signing | Kept secret along with a |
| R | The value `g^r mod q` | Published in the signature |
| h | A scalar derived from hashing R, A, and m | Computable by the verifier |
| s | The scalar `(r + ha) mod n` | Published in the signature |

The value h is the hash output interpreted as an integer and reduced modulo n, rather than the raw hash bytes. With fixed public parameters and an encoding that makes each item boundary unambiguous, the explanatory equations are:

$$
A=g^a\bmod q,\qquad R=g^r\bmod q
$$

$$
h=\operatorname{Int}(\operatorname{Hash}(\operatorname{enc}(R)\parallel\operatorname{enc}(A)\parallel m))\bmod n,\qquad s=(r+ha)\bmod n
$$

Here `Int` reads hash bytes as an integer, `enc` encodes a value, and `||` concatenates byte strings. The published signature is (R,s). The verifier recomputes h from R, A, and m and checks:

$$
g^s\equiv R A^h\pmod q
$$

Correct signing satisfies the equation because:

$$
g^s\equiv g^{r+ha}\equiv g^r(g^a)^h\equiv R A^h\pmod q
$$

Exponents can be reduced modulo n because `g^n = 1`. Verification does not require a or r; changing m also changes the hash input. The secret r is generated securely for each signature and is not reused across different messages.

These equations explain Schnorr-type signatures; this repository does not add an integer-group implementation. The correspondence between finite-field and curve forms, and the use of hashing to derive a challenge, can be followed in [Hao, RFC 8235 §2 and §3](https://www.rfc-editor.org/rfc/rfc8235.html#section-2). That RFC describes a proof of knowledge with a subtractive response. Here the presentation uses a message-bound signature form and the additive convention `s = r + ha` to connect to Ed25519.

## 4. Ed25519: expressing the Schnorr structure with curve points

### Replace exponentiation with scalar multiplication

Move the Schnorr structure from an integer multiplicative group to an elliptic-curve additive group:

| Role | Integer group above | Ed25519 points and scalars |
|---|---|---|
| Public generator | g | Base point B |
| Public key | `A = g^a mod q` | `A = [a]B` |
| Signature element | `R = g^r mod q` | `R = [r]B` |
| Signature scalar | `s = (r + ha) mod n` | `s = (r + ha) mod ℓ` |
| Central verification relation | `g^s = R A^h (mod q)` | `[s]B = R + [h]A` |

In this chapter, **uppercase B, A, and R denote points; lowercase a, r, h, and s denote scalars**. B is the specified public base point. The values a and r are secret; A, R, and s are public, and h is computed from public information.

$$
[s]B=[r+ha]B=[r]B+[h]([a]B)=R+[h]A
$$

Ed25519 instantiates this structure as an EdDSA scheme by specifying the curve, hash, encoding, and key-derived computations. [Josefsson and Liusvaara, RFC 8032 §1 and §5.1](https://www.rfc-editor.org/rfc/rfc8032.html#section-5.1)

### The Edwards curve model and its base point

Coordinates use the same field Fp as X25519, with this twisted Edwards equation:

$$
-x^2+y^2\equiv1+dx^2y^2\pmod p,\qquad d=-121665/121666
$$

The fraction denotes a field inverse. In this model, the identity is (0,1). The base point B has the same order ℓ: the full curve has 8ℓ points and B generates a subgroup of ℓ points. The correspondence with the Montgomery model is also used by the X25519 base-point function described above. Signature point encoding and X25519 u-coordinate encoding are defined separately.

### Key generation and signing in the code

The implementation covers Ed25519 without the prehash or context variants. It hashes a 32-byte seed with SHA-512, clears the lowest three bits and the highest bit of the first half, then sets the next-highest bit to obtain the secret scalar a. The remaining 32 secret bytes form the prefix used with message m to derive r. Signing derives r deterministically from the prefix and m rather than drawing fresh randomness.

| Mathematical computation | Code correspondence |
|---|---|
| `A = [a]B` | `keyPair` → `ge25519ScalarmultBase` → `ge25519P3ToBytes` |
| `r = LE(SHA512(prefix \|\| m)) mod ℓ` | `nonce` and `nonce_sc` in `signDetached` |
| `R = [r]B` | Reuses `ge25519ScalarmultBase` |
| `h = LE(SHA512(enc(R) \|\| enc(A) \|\| m)) mod ℓ` | `hram` and `hram_sc` |
| `s = (r + ha) mod ℓ` | [sc25519MulAdd](../src/curve25519/sc25519/sc25519-mul-add.js) |
| `enc(R) \|\| LE32(s)` | First and second 32-byte halves of `sig` |

`LE` interprets bytes in little-endian order; `LE32` encodes an integer into 32 little-endian bytes. Point encoding `enc` stores the y-coordinate and the sign bit of x in 32 bytes. The 64-byte `sk` produced by `keyPair` contains `seed || public key`, rather than a itself. Signing recomputes a and the prefix from the seed. Callers provide randomness and key storage.

### Verification and the negated point

`verifyDetached` checks lengths, the range of s, and point encodings, then decodes the public key as **−A**. [doubleScalarmultVartime](../src/curve25519/ed25519/double-scalarmult-vartime.js) uses that point to compute `Q = [s]B − [h]A`. The final check asks whether `R − Q` becomes the identity when multiplied by 8:

$$
[8]([s]B-R-[h]A)=\mathcal O
$$

This cofactored verification allows a difference that vanishes under multiplication by 8. When the public key and R belong to the subgroup of ℓ points, it agrees with the earlier relation `[s]B = R + [h]A`. [ge25519HasSmallOrder](../src/curve25519/ge25519/ge25519-has-small-order.js) performs the small-order test. The input public key and R are also checked to reject small-order points. Verification returns 0 for success and −1 for failure. [RFC 8032 §5.1.7](https://www.rfc-editor.org/rfc/rfc8032.html#section-5.1.7)

The range check must **read all 32 bytes and verify `0 ≤ s < ℓ`**. It cannot reuse the removal of the top bit performed when reading a coordinate. An inconsistency found while preparing this guide, and its minimal correction, are recorded in the [execution plan](plans/20261028-01-public-explanations/PLAN.md). The guide's h and s correspond to k and S in the RFC; code names include `hram`, `h`, and `S`. The explanatory notation does not rename code identifiers.

## 5. Coordinate representations: from two variables to three or four

Uppercase X, Y, Z, and T in this section are implementation names for coordinate components. Their role differs from the point symbols B, A, and R used above.

### Extra coordinates defer division

A curve point has two affine coordinates. During computation, carrying a common denominator Z lets addition and doubling proceed mainly through multiplication and squaring. Division in the field requires inversion; avoiding repeated inversions is the purpose of this representation.

| Representation | Meaning | Implementation |
|---|---|---|
| Affine | `(x,y)` | Recovered for point encoding |
| Projective | `(X,Y,Z)`, with `x=X/Z, y=Y/Z` | [ge25519P2](../src/curve25519/ge25519/ge25519-p2.js) |
| Extended | `(X,Y,Z,T)`, also satisfying `T/Z=xy`, or `XY=ZT` | [ge25519P3](../src/curve25519/ge25519/ge25519-p3.js), [point addition](../src/curve25519/ge25519/ge25519-add-cached.js) |
| Completed, an intermediate form | `(X,Y,Z,T)`, with `x=X/Z, y=Y/T` | [ge25519P1p1](../src/curve25519/ge25519/ge25519-p1p1.js), [conversion to P3](../src/curve25519/ge25519/ge25519-p1p1-to-p3.js) |
| X25519 projective pair | `(X,Z)`, with `u=X/Z` | Two points in [montgomeryLadder](../src/curve25519/x25519/montgomery-ladder.js) |

P3 and P1p1 both have four members, but their meanings differ. Converting P1p1 to P3 maps `(X,Y,Z,T)` to `(XT,YZ,ZT,XY)`, expressed as four multiplications in the code. When encoding a point, [ge25519P3ToBytes](../src/curve25519/ge25519/ge25519-p3-to-bytes.js) computes `1/Z` once and recovers x and y.

For the background of extended coordinates, see [Hisil et al., Twisted Edwards Curves Revisited (2008)](https://eprint.iacr.org/2008/522); concrete formulas also appear in [RFC 8032 §5.1.4](https://www.rfc-editor.org/rfc/rfc8032.html#section-5.1.4). These references explain the correspondence observed in the current code, rather than establishing which papers were consulted during its original development.

### Breaking down fixed-base scalar multiplication

[ge25519ScalarmultBase](../src/curve25519/ge25519/ge25519-scalarmult-base.js) splits the scalar into signed radix-16 digits and adds selected points from a precomputed table. It accumulates odd-position digits first, multiplies the result by 16, then adds even-position digits. Point coordinates and scalar digit decomposition are separate layers. [Bernstein et al., High-speed high-security signatures (2011)](https://eprint.iacr.org/2011/368) is an original paper describing the scheme's background.

## 6. Organizing integer arithmetic around BigInt

A limb representation stores an integer as fixed-width pieces, for example `x = Σ xᵢ 2^(wi)`, and handles cross-products and carries in the implementation. Here, a field element is the [fe25519](../src/curve25519/fe25519/fe25519.js) object `{ value: BigInt }`. Whole-integer multiplication is explicit in the source; the JavaScript engine manages the underlying digits.

The implementation then uses `2^255 ≡ 19 (mod p)` to fold the high part back into the low part with a factor of 19. Squaring also folds its input, while full normalization occurs at computation boundaries. This keeps the representation direct while controlling intermediate sizes. See the [field arithmetic guide](bigint-field-arithmetic.en.md) for the equations, code, and signed-input behavior.

For nonzero z, [fe25519Invert](../src/curve25519/fe25519/fe25519-invert.js) computes `z^(p−2)` through a fixed sequence of squarings and multiplications that reuses intermediate powers. The source expresses how to build the required exponent instead of calling a generic large-exponent operation.

## 7. SHA-512 and HKDF-SHA-512

### Building the hash from blocks

[sha512Update](../src/crypto/sha512/sha512-update.js) processes 128-byte blocks and buffers remaining bytes. [sha512Pad](../src/crypto/sha512/sha512-pad.js) appends the terminating one bit, zero padding, and the 128-bit message length. [sha512Transform](../src/crypto/sha512/sha512-transform.js) performs 80 compression rounds and updates eight 64-bit state words. The digest is 64 bytes. [NIST, FIPS 180-4 §5.1.2 and §6.4](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf)

The code holds 64-bit words as BigInts and uses [word64Add](../src/crypto/sha512/word64-add.js) for addition modulo `2^64`. [calcMSCH](../src/crypto/sha512/calc-msch.js) constructs the message schedule. [calcRNDr](../src/crypto/sha512/calc-rndr.js) rotates the order of references passed to [calcRND](../src/crypto/sha512/calc-rnd.js), which updates two state objects. The movement of working variables in the equations is represented by the ordering of object references.

### Extracting and expanding key material

[HMAC initialization](../src/crypto/sha512/hmac-sha512-init.js) prepares inner and outer SHA-512 states. HKDF Extract uses salt as the HMAC key and input key material IKM as the message, producing a 64-byte PRK. Expand builds successive blocks from the previous output, context, and a one-byte counter:

$$
PRK=HMAC\text{-}SHA512(salt,IKM)
$$

$$
T_0=\varepsilon,\qquad T_i=HMAC\text{-}SHA512(PRK,T_{i-1}\parallel info\parallel byte(i))
$$

The blocks are concatenated and truncated to the requested length. In [hkdfSha512Expand](../src/crypto/sha512/hkdf-sha512-expand.js), `ctx` is `info` and `out.length` selects the output length. Callers must keep it within `255 × 64 = 16320` bytes; this low-level function does not reject larger requests. [Krawczyk and Eronen, RFC 5869 §2](https://www.rfc-editor.org/rfc/rfc5869.html#section-2)

## 8. ChaCha20-Poly1305: verify before decrypting

[ChaCha20](../src/crypto/chacha20poly1305/chacha20-encrypt-bytes.js) holds its state in a `Uint32Array(16)`. It applies the addition, XOR, and rotation [quarter round](../src/crypto/chacha20poly1305/calc-quarter-round.js) in ten column/diagonal pairs, for 20 rounds. This 32-bit computation uses Number and typed arrays. [Poly1305](../src/crypto/chacha20poly1305/poly1305-blocks.js) instead uses BigInt for the block recurrence `h = (h + block)r mod (2^130−5)`. Here, block is the integer obtained by appending a one bit to each block. The representation follows the required integer width rather than forcing every component to use BigInt.

The [AEAD implementation](../src/crypto/chacha20poly1305/chacha20poly1305-encrypt-detached.js) uses a 32-byte key and 12-byte nonce. Counter 0 supplies the Poly1305 key; counters starting at 1 encrypt the plaintext. The authenticated input contains AAD, padding, ciphertext, padding, and their lengths, producing a 16-byte tag. AAD is authenticated but unencrypted information. Callers manage nonce uniqueness for each key. [Nir and Langley, RFC 8439 §2.3, §2.5, and §2.8](https://www.rfc-editor.org/rfc/rfc8439.html#section-2.8)

[Decryption](../src/crypto/chacha20poly1305/chacha20poly1305-decrypt-detached.js) computes and compares the tag before writing plaintext. A mismatch returns −1. The [combined-format entry](../src/crypto/chacha20poly1305/chacha20poly1305-encrypt.js) writes `ciphertext || tag`. Tag comparison exits early on a mismatch and is also outside any constant-time guarantee.

## 9. Verification and further reading

The [previous verification record](plans/20261028-00-resolve-reference-tests/PLAN.md) reports 201 existing tests, four point-decoding regression groups, and five algorithm groups compared with Node.js, all passing. The million-case sweep covers field inversion; it does not mean that all inputs to all algorithms have been tested. The added s-range check and the full rerun are recorded in [this work's plan](plans/20261028-01-public-explanations/PLAN.md).

The implementation demonstrates small functions that expose mathematical structure, choices of coordinates and integer representations, and established arithmetic adapted to BigInt. JavaScript BigInt does not guarantee constant-time execution, so this reference implementation does not guarantee side-channel resistance. Agreement with independent implementations on tested inputs, specification checks, and implementation choices are reported separately.

The [interoperability tests](../tests/interop.test.mjs) currently show how the functions are called. Standalone usage examples and browser validation are subsequent work.
