import { poly1305State } from '../../../../src/crypto/chacha20poly1305/poly1305-state.js';
import { poly1305Init } from '../../../../src/crypto/chacha20poly1305/poly1305-init.js';
import { poly1305Update } from '../../../../src/crypto/chacha20poly1305/poly1305-update.js';
import { poly1305Finish } from '../../../../src/crypto/chacha20poly1305/poly1305-finish.js';


function hex(bytes) {
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(' ');
}

const vectors = [
    {
        label: "RFC 8439 Test Vector #1",
        key: new Uint8Array(32).fill(0x00),
        msg: new Uint8Array(64).fill(0x00),
        tag: new Uint8Array(16).fill(0x00)
    },
    {
        label: "RFC 8439 Test Vector #2",
        key: Uint8Array.from([
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x36, 0xe5, 0xf6, 0xb5, 0xc5, 0xe0, 0x60, 0x70,
            0xf0, 0xef, 0xca, 0x96, 0x22, 0x7a, 0x86, 0x3e
        ]),
        msg: new TextEncoder().encode(`Any submission to the IETF intended by the Contributor for publication as all or part of an IETF Internet-Draft or RFC and any statement made within the context of an IETF activity is considered an "IETF Contribution". Such statements include oral statements in IETF sessions, as well as written and electronic communications made at any time or place, which are addressed to`),
        tag: Uint8Array.from([
            0x36, 0xe5, 0xf6, 0xb5, 0xc5, 0xe0, 0x60, 0x70,
            0xf0, 0xef, 0xca, 0x96, 0x22, 0x7a, 0x86, 0x3e
        ])
    },
    {
        label: "RFC 8439 Test Vector #3",
        key: Uint8Array.from([
            0x36, 0xe5, 0xf6, 0xb5, 0xc5, 0xe0, 0x60, 0x70,
            0xf0, 0xef, 0xca, 0x96, 0x22, 0x7a, 0x86, 0x3e,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
        ]),
        msg: new TextEncoder().encode(`Any submission to the IETF intended by the Contributor for publication as all or part of an IETF Internet-Draft or RFC and any statement made within the context of an IETF activity is considered an "IETF Contribution". Such statements include oral statements in IETF sessions, as well as written and electronic communications made at any time or place, which are addressed to`),
        tag: Uint8Array.from([
            0xf3, 0x47, 0x7e, 0x7c, 0xd9, 0x54, 0x17, 0xaf,
            0x89, 0xa6, 0xb8, 0x79, 0x4c, 0x31, 0x0c, 0xf0
        ])
    }
];

let allPassed = true;

for (const { label, key, msg, tag: expectedTag } of vectors) {
    const state = poly1305State();
    poly1305Init(state, key);
    poly1305Update(state, msg);
    const mac = new Uint8Array(16);
    poly1305Finish(state, mac);

    const match = expectedTag.every((b, i) => mac[i] === b);
    if (!match) {
        allPassed = false;
        console.error('RFC 8439 test vector FAILED.');
        console.error('Test Case:', label);
        console.error('Expected:', hex(expectedTag));
        console.error('Got     :', hex(mac));
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
