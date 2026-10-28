from pathlib import Path
import re,json,subprocess
root=Path(__file__).resolve().parents[4]
paths=['README.md','README.en.md','docs/algorithms.md','docs/algorithms.en.md','docs/bigint-field-arithmetic.md','docs/bigint-field-arithmetic.en.md']
links=0;externals=set();snippets=0
for rel in paths:
 p=root/rel;s=p.read_text()
 assert s.count('```')%2==0,rel
 assert s.count('$$')%2==0,rel
 # Equations such as [8](...) are not Markdown links.
 prose=re.sub(r'\$\$.*?\$\$','',s,flags=re.S)
 prose=re.sub(r'```.*?```','',prose,flags=re.S)
 for target in re.findall(r'\]\(([^)]+)\)',prose):
  if '://' in target: externals.add(target);continue
  assert (p.parent/target.split('#')[0]).exists(),(rel,target)
  links+=1
 for block in re.findall(r'```js\n(.*?)\n```',s,re.S):
  name=re.search(r'export function (\w+)',block).group(1)
  candidates={'fe25519Mul':'fe25519-mul.js','fe25519Sq':'fe25519-sq.js','fe25519Reduce':'fe25519-reduce.js'}
  assert block in (root/'src/curve25519/fe25519'/candidates[name]).read_text(),(rel,name)
  snippets+=1
pairs=[('docs/algorithms.md','docs/algorithms.en.md'),('docs/bigint-field-arithmetic.md','docs/bigint-field-arithmetic.en.md')]
for ja,en in pairs:
 a=(root/ja).read_text();b=(root/en).read_text()
 assert re.findall(r'\$\$(.*?)\$\$',a,re.S)==re.findall(r'\$\$(.*?)\$\$',b,re.S),(ja,en,'equations')
 assert set(re.findall(r'\]\((https?://[^)]+)\)',a))==set(re.findall(r'\]\((https?://[^)]+)\)',b)),(ja,en,'sources')
allowed=set(paths+['package.json','docs/source-changes.json','src/curve25519/ed25519/verify-detached.js','tests/signature-scalar.test.mjs'])
tracked=subprocess.check_output(['git','diff','--name-only','HEAD'],cwd=root,text=True).splitlines()
untracked=subprocess.check_output(['git','ls-files','--others','--exclude-standard'],cwd=root,text=True).splitlines()
assert all(p in allowed or p.startswith('docs/plans/20261028-01-public-explanations/') for p in tracked+untracked)
print(json.dumps({'documents':len(paths),'localLinks':links,'exactCodeQuotes':snippets,'bilingualEquationsAndSources':'matched','externalSources':sorted(externals),'changeScope':'within approved paths'},ensure_ascii=False,indent=2))
