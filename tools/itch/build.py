"""Deterministic, dependency-free itch.io HTML5 geometry-demo packaging and verification."""
from pathlib import Path,PurePosixPath
import argparse,hashlib,json,re,subprocess,sys,tempfile,zipfile,os
ROOT=Path(__file__).resolve().parents[2]
TASK=ROOT/'tasks/ITCH_DEMO_PACKAGING_001'
VERSION='1.2.0'
SOURCE=ROOT/'experiments/chapter_preview'
BACKGROUND='assets/backgrounds/chapter_one.png'
DOC='https://itch.io/docs/creators/html5'
LIMITS={'files':1000,'path_chars':240,'total_bytes':500_000_000,'file_bytes':200_000_000}
def sha(data):return hashlib.sha256(data).hexdigest()
def text(p):return p.read_text(encoding='utf-8-sig').replace('\r\n','\n')
def deterministic_zip(files):
 import io
 stream=io.BytesIO()
 with zipfile.ZipFile(stream,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
  for name,data in sorted(files.items()):
   info=zipfile.ZipInfo(name,(1980,1,1,0,0,0));info.create_system=3;info.external_attr=0o100644<<16;info.compress_type=zipfile.ZIP_DEFLATED
   z.writestr(info,data,compress_type=zipfile.ZIP_DEFLATED,compresslevel=9)
 return stream.getvalue()
def build():
 # Refuse stale source resource keys rather than silently packaging a mixed source release.
 subprocess.run([sys.executable,str(ROOT/'tools/version-runtime.py'),'--entry',str(SOURCE/'index.html'),'--check'],check=True,cwd=ROOT)
 files={};sources={};links={}
 def put(source,folder,stem,content=None):
  original=(ROOT/source).read_bytes();sources[source]=sha(original if source.endswith('.png') else text(ROOT/source).encode())
  data=original if source.endswith('.png') else text(ROOT/source).encode()
  if content is not None:data=content.encode()
  suffix=Path(source).suffix;name=f'{folder}/{stem}.{sha(data)[:16]}{suffix}';files[name]=data;return name
 bg=put(BACKGROUND,'assets','chapter-one')
 core=put('experiments/first_playable_001/core.js','js','core')
 geometry=text(ROOT/'tools/level_generator/geometry.js')
 fallback="root.PuzzleCore||(typeof require==='function'?require('../../experiments/first_playable_001/core.js'):null)"
 if geometry.count(fallback)!=1:raise ValueError('BUILD_TRANSFORM_MISMATCH_GEOMETRY')
 geometry=put('tools/level_generator/geometry.js','js','geometry',geometry.replace(fallback,'root.PuzzleCore'))
 levels=put('experiments/chapter_preview/levels.js','js','levels')
 animals=text(SOURCE/'animals.js')
 animal_sources=re.findall(r"src:'([^']+)'",animals)
 assert animal_sources and len(animal_sources)==len(set(animal_sources))
 animal_exports=[]
 for source in animal_sources:
  relative=source.split('?')[0].removeprefix('../../')
  exported=put(relative,'assets',Path(relative).stem);animal_exports.append(exported)
  animals=animals.replace(source,exported)
 animals=put('experiments/chapter_preview/animals.js','js','animals',animals)
 game=text(SOURCE/'game.js');old="../../assets/backgrounds/chapter_one.png"
 if game.count(old)!=1:raise ValueError('BUILD_TRANSFORM_MISMATCH_BACKGROUND')
 game=put('experiments/chapter_preview/game.js','js','game',game.replace(old,bg))
 css=put('experiments/chapter_preview/style.css','css','style')
 links={'../first_playable_001/core.js':core,'../../tools/level_generator/geometry.js':geometry,'levels.js':levels,'game.js':game,'animals.js':animals,'style.css':css}
 html=text(SOURCE/'index.html');sources['experiments/chapter_preview/index.html']=sha(html.encode())
 def remap(m):
  source=m.group(2).split('?')[0]
  if source not in links:raise ValueError('UNDECLARED_SOURCE_DEPENDENCY '+source)
  return m.group(1)+links[source]+m.group(3)
 html=re.sub(r'((?:src|href)=")([^\"]+)(")',remap,html)
 files['index.html']=html.encode()
 build_id=sha(json.dumps({'builder':sha(Path(__file__).read_bytes().replace(b'\r\n',b'\n')),'sources':sources,'mode':'partial-animal-private-test'},sort_keys=True).encode())[:20]
 manifest={'builder_version':VERSION,'build_id':build_id,'entry':'index.html','mode':'PARTIAL_ANIMAL_PRIVATE_TEST_ONLY','public_animal_release':'BLOCKED_PENDING_ALL_11_WHOLE_ANIMAL_G1_G2_G3_G4_AND_RUNTIME_INTEGRATION','levels':8,'animal_images':animal_exports,'runtime_dependencies':'self-contained; no external services/CDN/fonts required','source_files':sources,'files':{n:{'bytes':len(d),'sha256':sha(d)} for n,d in sorted(files.items())}}
 files['build-manifest.json']=(json.dumps(manifest,sort_keys=True,ensure_ascii=False,indent=2)+'\n').encode()
 return files,manifest
def validate(data):
 import io
 with zipfile.ZipFile(io.BytesIO(data)) as z:
  names=z.namelist();assert 'index.html' in names and len(names)==len(set(names)) and len(names)<=LIMITS['files']
  assert len({n.casefold() for n in names})==len(names)
  total=0
  for entry in z.infolist():
   n=entry.filename;p=PurePosixPath(n)
   assert not p.is_absolute() and '..' not in p.parts and '\\' not in n and ':' not in n and len(n)<=LIMITS['path_chars']
   assert entry.file_size<=LIMITS['file_bytes'];total+=entry.file_size
  assert total<=LIMITS['total_bytes']
  manifest=json.loads(z.read('build-manifest.json'))
  assert set(names)==set(manifest['files'])|{'build-manifest.json'}
  for n,info in manifest['files'].items():assert sha(z.read(n))==info['sha256'] and len(z.read(n))==info['bytes']
  html=z.read('index.html').decode();references=re.findall(r'(?:src|href)="([^\"]+)"',html)
  for ref in references:assert ref in names and not ref.startswith('/') and '://' not in ref
  assert len(references)==6
  assert len([n for n in names if n.endswith('.png')])==1+len(manifest['animal_images'])
  assert all(n in names for n in manifest['animal_images'])
  js='\n'.join(z.read(n).decode() for n in names if n.endswith('.js'))
  image_refs=re.findall(r"\.src=['\"]([^'\"]+)['\"]",js)
  image_refs+=re.findall(r"src:'([^']+)'",js)
  assert len(image_refs)==1+len(manifest['animal_images']) and all(r in names for r in image_refs)
  assert not re.search(r'https?://|localhost|127\.0\.0\.1|/assets/animals/',js)
  assert '左键拖动' in html and '右键旋转' in html and 'R 重置' in html and '其余形状为占位' in html
  return {'status':'PASS','zip_bytes':len(data),'file_count':len(names),'uncompressed_bytes':total,'longest_path_chars':max(map(len,names)),'root_index':True,'case_sensitive_dependency_closure':True,'external_runtime_dependencies':0,'animal_images_included':len(manifest['animal_images']),'manifest_hashes_match':True,'limits':LIMITS,'rules_source':DOC,'rules_checked_on':'2026-10-25','build_id':manifest['build_id'],'sha256':sha(data)}
def main():
 parser=argparse.ArgumentParser();parser.add_argument('--browser',action='store_true');parser.add_argument('--release',action='store_true');parser.add_argument('--output',default='builds/itch/animal-puzzle-partial-animal-test.zip');parser.add_argument('--report-dir',default='tasks/ITCH_DEMO_PACKAGING_001');args=parser.parse_args()
 global TASK
 TASK=(ROOT/args.report_dir).resolve()
 if not TASK.is_relative_to(ROOT/'tasks'):parser.error('report directory must stay inside repository tasks/')
 if args.release:parser.exit(2,'PUBLIC_RELEASE_BLOCKED: current runtime is geometric; all 11 whole-animal mappings and G1/G2/G3/G4 must be integrated before a separate approved release workflow.\n')
 output=(ROOT/args.output).resolve()
 if not output.is_relative_to(ROOT/'builds'):parser.error('output must stay inside repository builds/')
 files,manifest=build();data=deterministic_zip(files);report=validate(data)
 # Same source inputs must produce an identical archive, including ZIP metadata.
 again,_=build();assert data==deterministic_zip(again);report['two_builds_byte_identical']=True
 output.parent.mkdir(parents=True,exist_ok=True);output.write_bytes(data)
 TASK.mkdir(parents=True,exist_ok=True);(TASK/'build-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');print(json.dumps(report))
 if args.browser:
  with tempfile.TemporaryDirectory(prefix='itch-extracted-build-',dir=ROOT/'builds/itch') as tmp:
   with zipfile.ZipFile(output) as z:z.extractall(tmp)
   subprocess.run(['node',str(ROOT/'tools/itch/test-package.cjs'),'--root',tmp],cwd=ROOT,check=True,env={**os.environ,'ITCH_REPORT_DIR':str(TASK)})
if __name__=='__main__':main()
