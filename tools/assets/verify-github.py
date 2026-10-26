"""Read committed original PNG bytes from GitHub using a pinned intake report."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import argparse,hashlib,json,re,urllib.request
parser=argparse.ArgumentParser();parser.add_argument('commit');parser.add_argument('--report-dir',required=True);parser.add_argument('--proxy');args=parser.parse_args()
assert re.fullmatch('[0-9a-f]{40}',args.commit)
root=Path(__file__).resolve().parents[2];task=(root/args.report_dir).resolve();assert task.is_relative_to(root/'tasks')
assets=json.loads((task/'asset-report.json').read_text(encoding='utf-8'))['assets']
def verify(a):
 url='https://raw.githubusercontent.com/Justalittlebittt/-/'+args.commit+'/'+a['repository_file']
 handlers=[urllib.request.ProxyHandler({'http':args.proxy,'https':args.proxy})] if args.proxy else []
 with urllib.request.build_opener(*handlers).open(url,timeout=30) as response:data=response.read();status=response.status
 digest=hashlib.sha256(data).hexdigest();assert status==200 and digest==a['sha256'] and len(data)==a['bytes'],a['shape_id']+' REMOTE_BYTES_MISMATCH'
 return {'shape_id':a['shape_id'],'url':url,'http_status':status,'bytes':len(data),'sha256':digest,'matches_pinned_desktop_original':True}
with ThreadPoolExecutor(max_workers=len(assets)) as pool:results=list(pool.map(verify,assets))
report={'status':'PASS_GITHUB_RAW_BINARY_READBACK','implementation_commit':args.commit,'assets':results}
(task/'github-readback.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');print(json.dumps(report))
