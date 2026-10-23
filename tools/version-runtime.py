"""Version local script/style URLs by content so an existing browser cannot mix releases."""
from pathlib import Path
import hashlib,re
entry=Path(__file__).resolve().parents[1]/'experiments/panda_v2/index.html'
s=entry.read_text(encoding='utf-8')
def version(m):
 path=m.group(2).split('?')[0]
 target=entry.parent/path
 digest=hashlib.sha256(target.read_bytes()).hexdigest()[:16]
 return m.group(1)+path+'?v='+digest+m.group(3)
s=re.sub(r'((?:src|href)=")([^"?]+(?:\?[^\"]*)?)(")',version,s)
entry.write_text(s,encoding='utf-8')
