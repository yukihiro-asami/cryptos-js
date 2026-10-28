# Field arithmetic with BigInt: folding and normalization

[日本語](bigint-field-arithmetic.md) · [Algorithm guide](algorithms.en.md) · [README](../README.en.md)

This implementation directly expresses pseudo-Mersenne reduction for the prime **p = 2^255 − 19** using JavaScript BigInt. Partial reduction controls intermediate sizes, while full normalization occurs at computation boundaries. Squaring also partially reduces its input.

The code illustrates how established mathematical techniques can be adapted to an integer representation. Folding before and after squaring is an implementation choice, rather than a claim to a new cryptographic algorithm.

## Folding high bits back with a factor of 19

Set `B = 2^255`. Since `p = B − 19`, B is congruent to 19 modulo p. Splitting an integer into low and high parts gives:

$$
x = lo + hi B \equiv lo + 19hi \pmod p
$$

The [multiplication implementation](../src/curve25519/fe25519/fe25519-mul.js) expresses that relation directly:

```js
export function fe25519Mul(h, f, g) {
    const x = f.value * g.value;
    const lo = x & MASK_255;
    const hi = x >> 255n;
    h.value = lo + 19n * hi;
}
```

[MASK_255](../src/curve25519/const.js) is `2^255 − 1`: AND extracts the low 255 bits, and right shift obtains the high part. Multiplying the high part by 19 and adding it back folds the product instead of immediately applying `% P`. For example, `x = 2^255 + 7` folds to `7 + 19 = 26`.

Reduction using a prime just below a power of two is called pseudo-Mersenne reduction. Nath and Sarkar discuss multiplication, squaring, and reduction algorithms for these fields. [Efficient Arithmetic In (Pseudo-)Mersenne Prime Order Fields, 2018](https://eprint.iacr.org/2018/985)

## Folding before squaring as well

The [squaring function](../src/curve25519/fe25519/fe25519-sq.js) folds the input once, squares that value, and folds the output:

```js
export function fe25519Sq(h, f) {
    const f_lo = f.value & MASK_255;
    const f_hi = f.value >> 255n;
    const f_folded = f_lo + 19n * f_hi;

    const x = f_folded * f_folded;
    const lo = x & MASK_255;
    const hi = x >> 255n;
    h.value = lo + 19n * hi;
}
```

The folded and original inputs are congruent modulo p, so their squares are also congruent. When an input has grown large, this arrangement avoids immediately squaring that large value. We have not established a separate name for this particular arrangement.

BigInt lets the source express multiplication and shifts on one integer. A fixed-width limb representation also needs explicit digit arithmetic and carry handling. Both implement field arithmetic, but their operations and costs are not identical. This code chooses to manage intermediate sizes around arbitrary-precision arithmetic. The speed benefit of this folding step alone has not been measured.

## Partial reduction and lazy reduction

| Term | Meaning in this code |
|---|---|
| Pseudo-Mersenne reduction | Folding the high part using `2^255 ≡ 19 (mod p)` |
| Partial reduction | Continuing with a congruent value without requiring it to lie in `0 ≤ x < p` |
| Lazy reduction | Deferring full normalization to boundaries instead of performing it after every operation |

Partial reduction describes the representation; lazy reduction describes scheduling. Scott's *Slothful reduction* discusses delaying full reductions as lazy reduction. This does not identify the code with the paper's specific algorithms. [Slothful reduction, 2017](https://eprint.iacr.org/2017/437)

One fold does not guarantee a result below p. Under the condition `0 ≤ f,g < p`, the product is below `B^2`, and folding puts it below `20B`. A second fold of a value in that range gives a result below `B + 361`, which still need not be below p. These bounds apply to the stated inputs, not to every intermediate value throughout the callers.

Full normalization into `0 ≤ x < p` is a separate function, [fe25519Reduce](../src/curve25519/fe25519/fe25519-reduce.js):

```js
export function fe25519Reduce(h) {
    h.value = ((h.value % P) + P) % P;
}
```

The scheduling can be seen in these callers:

- [Fixed-base scalar multiplication](../src/curve25519/ge25519/ge25519-scalarmult-base.js) normalizes coordinates after point additions and coordinate conversions.
- [Inversion](../src/curve25519/fe25519/fe25519-invert.js) normalizes at the end of its squaring-and-multiplication sequence.
- The [X25519 Montgomery ladder](../src/curve25519/x25519/montgomery-ladder.js) normalizes coordinates in each loop iteration.

Normalization is placed at operation boundaries; it is not deferred unconditionally until the very end.

## Signed BigInts preserve congruence

[Subtraction](../src/curve25519/fe25519/fe25519-sub.js) can produce negative intermediates. BigInt defines signed right shift and two's-complement-style bit operations, so the following decomposition also holds for negative integers. [ECMAScript BigInt definition](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-bigint-signedRightShift)

$$
hi = \lfloor x/B \rfloor,\quad lo = x-hiB,\quad 0\le lo<B
$$

Let the folded value be F(x). Then:

$$
F(x) = lo+19hi = x-hi(B-19)=x-hi p
$$

It is therefore congruent to x regardless of sign. For `x = -1`, `lo = B−1` and `hi = -1`, so the result is `B−20 = p−1`.

A partial reduction need not produce a nonnegative value, nor does it reduce the absolute value of every small negative input. Congruence, value size, and normalization into `0 ≤ x < p` are separate properties. BigInt does not wrap from fixed-width integer overflow, but operand size affects computation time and memory use.

## Verification and scope

[The import record](import-report.md) preserves original-file comparisons, independent-implementation comparisons on specified inputs, and the subsequent resolution of the initial test failures. See the [current plan](plans/20261028-01-public-explanations/PLAN.md) for the additional Ed25519 input check discovered during documentation work. Updating this arithmetic explanation does not extend its arithmetic test coverage.

This reference library connects the mathematical basis of established methods to their code. BigInt does not guarantee constant-time execution, so the implementation does not guarantee side-channel resistance. The consultation response and the corrections used in arranging the references are preserved in the [review record](reviews/grok-reduction.md).
