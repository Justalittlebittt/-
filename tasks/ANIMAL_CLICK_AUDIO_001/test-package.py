"""Exercise audio export with a QA-only tone; never bind it in the delivered game."""
from pathlib import Path
import json,os,subprocess,sys,tempfile,zipfile
ROOT=Path(__file__).resolve().parents[2];TASK=Path(__file__).parent
sys.path.insert(0,str(ROOT/'tools/itch'));import build
overrides={'I3':'../../tasks/ANIMAL_CLICK_AUDIO_001/fixtures/qa-click-tone.wav'}
files,manifest=build.build(overrides);data=build.deterministic_zip(files);report=build.validate(data)
again,_=build.build(overrides);assert data==build.deterministic_zip(again)
assert report['audio_files_included']==1
checks=[]
for name,change in [('missing_audio',lambda f:f.pop(manifest['audio_files'][0])),('external_audio_path',None),('outside_repository_path',None)]:
 try:
  if change:
   broken=dict(files);change(broken);build.validate(build.deterministic_zip(broken))
  else:build.build({'I3':'https://example.invalid/no.wav' if name=='external_audio_path' else '../../../../../outside.wav'})
 except (AssertionError,KeyError,ValueError,FileNotFoundError):checks.append(name)
 else:raise AssertionError('INVALID_AUDIO_CONFIG_ACCEPTED '+name)
folder=ROOT/'builds/audio-qa';folder.mkdir(parents=True,exist_ok=True);(folder/'qa-tone-package.zip').write_bytes(data)
out=TASK/'audio-package';out.mkdir(exist_ok=True);report.update(test_fixture_only=True,negative_audio_cases=checks,two_builds_identical=True)
(out/'build-report.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
with tempfile.TemporaryDirectory(prefix='audio-extracted-',dir=folder) as tmp:
 with zipfile.ZipFile(folder/'qa-tone-package.zip') as z:z.extractall(tmp)
 subprocess.run(['node',str(ROOT/'tools/itch/test-package.cjs'),'--root',tmp],cwd=ROOT,check=True,env={**os.environ,'ITCH_REPORT_DIR':str(out)})
print(json.dumps({'status':'PASS_AUDIO_EXPORT_AND_BROWSER_QA','negative_audio_cases':checks}))
