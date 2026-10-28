# cryptos-js

[日本語](README.md)

**Cryptographic algorithms, from equations to vanilla JavaScript.**

Handwritten reference implementations of Ed25519, X25519, SHA-512, HKDF-SHA-512, and ChaCha20-Poly1305 by Yukihiro Asami. The code and explanations demonstrate understanding of the algorithms and the ability to implement and verify their computations from scratch.

Field arithmetic is expressed directly with BigInt, with established reduction methods placed to control intermediate sizes. Signatures use coordinate conversions and precomputed tables. SHA-512 uses BigInt for 64-bit words; ChaCha20 uses Number and typed arrays for 32-bit words. The explanations connect these choices to the actual code.

## Start reading

| What you want to understand | Guide |
|---|---|
| X25519 → Schnorr → Ed25519, from finite fields and subgroups to internal computations | [From equations to code](docs/algorithms.en.md) |
| BigInt folding, partial reduction before squaring, and normalization boundaries | [BigInt field arithmetic](docs/bigint-field-arithmetic.en.md) |
| Which inputs were tested, how they were compared, and the results | [Import and verification record](docs/import-report.md), [latest fixes and verification](docs/reviews/claude-ed25519-fixes.md) (Japanese) |
| Function calls and comparisons with an independent implementation | [Interoperability tests](tests/interop.test.mjs) |

Explanations are available in Japanese and English. Each guide links to the corresponding code and primary sources.

## Components and entry points

| Component | Implementation |
|---|---|
| Ed25519 | [Key generation](src/curve25519/ed25519/key-pair.js), [signing](src/curve25519/ed25519/sign-detached.js), [verification](src/curve25519/ed25519/verify-detached.js) |
| X25519 | [Scalar multiplication](src/curve25519/x25519/scalarmult-curve25519.js), [base-point multiplication](src/curve25519/x25519/scalarmult-curve25519-base.js) |
| SHA-512 | [Hashing](src/crypto/sha512/sha512.js) |
| HKDF-SHA-512 | [Extract](src/crypto/sha512/hkdf-sha512-extract.js), [Expand](src/crypto/sha512/hkdf-sha512-expand.js) |
| ChaCha20-Poly1305 | [Encryption](src/crypto/chacha20poly1305/chacha20poly1305-encrypt.js), [decryption](src/crypto/chacha20poly1305/chacha20poly1305-decrypt.js) |

The cryptographic computations are JavaScript ES modules, without delegation to WebCrypto or external cryptographic packages. The existing low-level API is retained: callers supply seeds, keys, nonces, and input/output buffers. Authentication protocols, applications, and servers are outside this library. This project is separate from CryptoJS.

## Run verification

Node.js 24 or later. No dependency installation or build is required.

```sh
npm test
```

On 2026-10-28, all of the following passed on Node.js v24.22.1 / macOS arm64:

| Check | Result |
|---|---|
| Selected existing tests | 201/201 passed, including a million-case field-inversion sweep |
| Added regressions | 11/11 groups passed: four point-decoding groups, two signature-scalar range groups, and five arithmetic/conversion/signature regression groups |
| Comparison with Node.js cryptography | 5/5 groups passed, comparing public keys, signatures, shared secrets, digests, derived material, ciphertexts, and tags |
| Provenance and dependencies | Hashes of 324 files and local import references checked |

Run the stages separately with `npm run check:imports`, `npm run test:reference`, `npm run test:regression`, or `npm run test:interop`. Existing tests have a 15-second per-file timeout, except for the million-case test's 600-second limit. `npm run test:reference -- --timeout-ms=600000` overrides the limit for all existing tests. Timeouts are failures. Runtime depends on the environment; the million-case test took about 42 seconds in the preceding work.

Some existing tests check shapes only; the number of tests is not an algorithm coverage metric. The linked verification records specify the tested inputs and results.

## Reference implementation scope

The guides distinguish mathematical definitions, prior techniques, and implementation choices adapted to BigInt. JavaScript BigInt does not guarantee constant-time execution, so this implementation does not guarantee side-channel resistance. It is a reference for reading, verifying, and discussing the computations.

The original assets came from rainfrog_truth's frog/worker tree. The [source manifest](docs/source-manifest.json) records original paths, commit, and hashes. The [change log](docs/source-changes.json) records post-import modifications and hashes. The [Grok response and corrections](docs/reviews/grok-reduction.md) are also preserved in Japanese.

The project is being prepared for GitHub publication. Node.js verification and bilingual explanations are in place. Standalone examples, browser validation, and license selection are subsequent work. A license has not yet been selected, and npm publication is disabled.
