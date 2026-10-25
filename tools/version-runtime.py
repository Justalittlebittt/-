"""Version local script/style URLs by content so an existing browser cannot mix releases."""
from pathlib import Path
import hashlib,re,sys
entry=(Path(sys.argv[sys.argv.index('--entry')+1]).resolve() if '--entry' in sys.argv else Path(__file__).resolve().parents[1]/'experiments/panda_v2/index.html')
original=entry.read_text(encoding='utf-8')
s=original
def version(m):
 path=m.group(2).split('?')[0]
 target=entry.parent/path
 digest=hashlib.sha256(target.read_bytes().replace(b'\r\n',b'\n')).hexdigest()[:16]
 return m.group(1)+path+'?v='+digest+m.group(3)
s=re.sub(r'((?:src|href)=")([^"?]+(?:\?[^\"]*)?)(")',version,s)
if '--check' in sys.argv:
 if s!=original:
  raise SystemExit('FAIL_STALE_RESOURCE_VERSION: run python tools/version-runtime.py before delivery')
 print('PASS_RUNTIME_VERSIONS')
else:
 entry.write_text(s,encoding='utf-8')
