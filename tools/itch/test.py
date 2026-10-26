"""Negative packaging checks: reject broken roots, paths, dependencies and unsafe archives."""
from pathlib import Path
import argparse,copy,json,subprocess,sys
import build
parser=argparse.ArgumentParser();parser.add_argument('--report-dir',default='tasks/ITCH_DEMO_PACKAGING_001');args=parser.parse_args()
build.TASK=(build.ROOT/args.report_dir).resolve()
if not build.TASK.is_relative_to(build.ROOT/'tasks'):parser.error('report directory must stay inside repository tasks/')
build.TASK.mkdir(parents=True,exist_ok=True)
files,manifest=build.build();checks=[]
def reindex(f):
 m=copy.deepcopy(manifest);m['files']={n:{'bytes':len(d),'sha256':build.sha(d)} for n,d in f.items() if n!='build-manifest.json'};f['build-manifest.json']=(json.dumps(m,sort_keys=True,ensure_ascii=False,indent=2)+'\n').encode();return f
def reject(name,mutate,rewrite_manifest=True):
 f=dict(files);mutate(f)
 if rewrite_manifest:reindex(f)
 try:build.validate(build.deterministic_zip(f))
 except (AssertionError,ValueError,KeyError):checks.append(name)
 else:raise AssertionError('INVALID_PACKAGE_ACCEPTED '+name)
reject('missing_root_index',lambda f:f.pop('index.html'))
css=next(n for n in files if n.endswith('.css'))
reject('case_mismatch',lambda f:f.__setitem__(css.upper(),f.pop(css)))
reject('absolute_resource_path',lambda f:f.__setitem__('index.html',f['index.html'].replace(b'src="js/',b'src="/js/',1)))
reject('external_resource_url',lambda f:f.__setitem__('index.html',f['index.html'].replace(b'src="js/',b'src="https://example.invalid/js/',1)))
bg=next(n for n in files if n.endswith('.png'))
reject('missing_background',lambda f:f.pop(bg))
reject('zip_path_traversal',lambda f:f.__setitem__('../escape.js',b'no'))
reject('case_collision',lambda f:f.__setitem__('INDEX.html',f['index.html']))
game=next(n for n in files if '/game.' in n)
reject('manifest_checksum_tampering',lambda f:f.__setitem__(game,f[game]+b'\n//tampered'),False)
reject('file_count_over_1000',lambda f:f.update({f'extra/{i}.txt':b'x' for i in range(1001)}))
result=subprocess.run([sys.executable,str(Path(__file__).with_name('build.py')),'--release'],capture_output=True,text=True)
assert result.returncode==2 and 'PUBLIC_RELEASE_BLOCKED' in result.stderr;checks.append('public_release_mode_blocked')
report={'status':'PASS','rejected_invalid_cases':checks,'negative_checks':len(checks),'published_to_itch':False};(build.TASK/'negative-test-report.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8');print(json.dumps(report))
