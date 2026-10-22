from pathlib import Path
import hashlib,json,sys
from PIL import Image
root=Path(__file__).resolve().parents[2]
p=root/'assets/animals/panda_rect6_v2.png'
expected='8ebf034a8cc3e2ab7c25ec17a6861992f76c880275f5b6ebe07765db417d6f83'
r={'path':str(p.relative_to(root)),'expected_sha256':expected,'status':'ASSET_LOCAL_MISSING','G1':'NOT_RUN','G2_visual':'NOT_RUN','G4_formal':'NOT_RUN'}
if p.exists():
 data=p.read_bytes();r.update(bytes=len(data),sha256=hashlib.sha256(data).hexdigest())
 if r['sha256']!=expected:r['status']='SOURCE_PNG_SHA256_MISMATCH'
 else:
  assert data[:8]==b'\x89PNG\r\n\x1a\n'
  with Image.open(p) as im:
   im.load();r.update(mode=im.mode,dimensions=list(im.size))
   assert im.mode=='RGBA'
   alpha=im.getchannel('A');r.update(alpha_extrema=alpha.getextrema(),alpha_bbox=alpha.getbbox())
   r['status']='BYTE_AND_DECODE_PRECHECK_PASS';r['G1']='PARTIAL_ALPHA_EDGES_METADATA_LICENSE_PENDING'
print(json.dumps(r,indent=2))
out=root/'tasks/CODEX_TAKEOVER_001/asset-report.json';out.parent.mkdir(parents=True,exist_ok=True);out.write_text(json.dumps(r,indent=2)+'\n')
sys.exit(0 if r['status']=='BYTE_AND_DECODE_PRECHECK_PASS' else 2)
