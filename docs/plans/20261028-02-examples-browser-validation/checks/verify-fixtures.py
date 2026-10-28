"""Independently recompute SHA-512/HKDF expectations from fixture-results.json."""
from pathlib import Path
import hashlib, hmac, json

data = json.loads(Path(__file__).with_name('fixture-results.json').read_text())
sha = data['sha512']
assert hashlib.sha512(sha['message'].encode()).hexdigest() == sha['digest']
v = data['hkdf']
prk = hmac.digest(bytes.fromhex(v['salt']), bytes.fromhex(v['ikm']), 'sha512')
assert prk.hex() == v['prk']
# This example requests 42 bytes, so one 64-byte Expand block suffices.
output = hmac.digest(prk, bytes.fromhex(v['info']) + b'\x01', 'sha512')[:v['length']]
assert output.hex() == v['output']
print('Python hashlib/hmac: SHA-512 digest, HKDF PRK and 42-byte OKM match (3/3).')
