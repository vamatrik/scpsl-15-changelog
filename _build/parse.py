import json,re,sys
t=open('../_src/changelog.txt',encoding='utf-8-sig').read().replace('\r','')
lines=t.split('\n')
entries=[]  # dict(kind, level, text)
for ln in lines[1:]:
    if not ln.strip(): continue
    m=re.match(r'^( *)\* (.*)$',ln)
    if m:
        entries.append({'k':'b','lv':len(m.group(1))//3,'t':m.group(2).strip()})
    elif ln.startswith('Developer Commentary:'):
        entries.append({'k':'c','t':ln[len('Developer Commentary:'):].strip()})
    else:
        entries.append({'k':'h','t':ln.strip()})
json.dump(entries,open('en_entries.json','w',encoding='utf-8'),ensure_ascii=False,indent=0)
n=0
with open('en_numbered.txt','w',encoding='utf-8') as f:
    for e in entries:
        if e['k']=='h': f.write('## '+e['t']+'\n')
        else:
            n+=1; e['n']=n
            f.write(f"{n}|{e['t']}\n")
json.dump(entries,open('en_entries.json','w',encoding='utf-8'),ensure_ascii=False)
print(n, sum(1 for e in entries if e['k']=='h'))
