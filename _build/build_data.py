import json,glob
E=json.load(open('en_entries.json',encoding='utf-8'))
ru={}
for f in sorted(glob.glob('ru/*.txt')):
    for l in open(f,encoding='utf-8'):
        l=l.rstrip('\n')
        if not l: continue
        n,t=l.split('|',1); ru[int(n)]=t
out=[None]
n=0
for e in E:
    if e['k']=='h': continue
    n+=1
    out.append({'k':e['k'],'lv':e.get('lv',0),'en':e['t'],'ru':ru[n]})
assert n==637 and len(ru)==637
import os
os.makedirs('../js',exist_ok=True)
with open('../js/data.js','w',encoding='utf-8') as f:
    f.write('/* Generated from the public v15.0.0 Beta Changelog (Northwood Studios). RU translation: fan-made. */\n')
    f.write('window.CL_ENTRIES='+json.dumps(out,ensure_ascii=False,separators=(',',':'))+';\n')
print('ok', os.path.getsize('../js/data.js'))
import random
for i in random.sample(range(1,638),6): print(i, out[i]['en'][:50],' || ', out[i]['ru'][:50])
