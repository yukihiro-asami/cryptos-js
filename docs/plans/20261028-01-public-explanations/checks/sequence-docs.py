from pathlib import Path
import contextlib,io,json,re,runpy
root=Path(__file__).resolve().parents[4]
capture=io.StringIO()
with contextlib.redirect_stdout(capture):
 runpy.run_path(str(Path(__file__).with_name('check-docs.py')))
result=json.loads(capture.getvalue())
rows=tables=0
for rel in ['README.md','README.en.md','docs/algorithms.md','docs/algorithms.en.md']:
 text=(root/rel).read_text();width=None
 for i,line in enumerate(text.splitlines(),1):
  if line.startswith('|'):
   count=len(re.findall(r'(?<!\\)\|',line))
   if width is None: width=count;tables+=1
   assert count==width,(rel,i,'table column mismatch',count,width)
   rows+=1
  else: width=None
 if rel.startswith('docs/algorithms'):
  headers=re.findall(r'^## (\d+)\. (.*)$',text,re.M)
  assert [int(n) for n,_ in headers]==list(range(1,10)),headers
  assert 'X25519' in headers[1][1]
  assert any(s in headers[2][1] for s in ['Schnorr','シュノア'])
  assert 'Ed25519' in headers[3][1]
  assert '[S]B' not in text and '[k]A' not in text
result.update({'markdownTables':tables,'tableRows':rows,'chapterOrder':'X25519 -> Schnorr -> Ed25519','explanatorySignatureScalars':'h and s','checksPassed':True})
print(json.dumps(result,ensure_ascii=False,indent=2))
