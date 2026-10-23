from pathlib import Path
from PIL import Image
import hashlib,json
r=Path('.');out=[]
for kind,filename,expected,size,grid in [('rabbit','rabbit_square4_ears_folded_v2.png','00ae48b4ee3c9f413cf996c239625f35a9ba946a8648225ed5dea9dc269ace74',(1254,1254),(2,2)),('panda','panda_rect6_desktop_001.png','e88018fb1b8d992834f11ca25303161f28ce2643db6deefe1555c03f54311732',(1536,1024),(3,2))]:
 p=r/'assets/animals'/filename;data=p.read_bytes();assert data[:8]==b'\x89PNG\r\n\x1a\n';sha=hashlib.sha256(data).hexdigest();assert sha==expected
 im=Image.open(p);im.load();assert im.mode=='RGBA' and im.size==size;a=im.getchannel('A');hist=a.histogram();w,h=size
 quadrants=[]
 for y in range(grid[1]):
  for x in range(grid[0]):
   tile=a.crop((round(x*w/grid[0]),round(y*h/grid[1]),round((x+1)*w/grid[0]),round((y+1)*h/grid[1])));quadrants.append(sum(tile.histogram()[128:])/(tile.width*tile.height))
 out.append({'kind':kind,'sha256':sha,'bytes':len(data),'mode':im.mode,'dimensions':size,'alpha_extrema':a.getextrema(),'alpha_bbox':a.getbbox(),'threshold_bboxes':{str(t):a.point(lambda v:255 if v>=t else 0).getbbox() for t in [16,128,240]},'corners':[a.getpixel(v) for v in [(0,0),(w-1,0),(0,h-1),(w-1,h-1)]],'transparent_pixels':hist[0],'partially_transparent_pixels':sum(hist[1:255]),'opaque_pixels':hist[255],'cell_main_mass_coverage':quadrants,'byte_decode_status':'PASS','edge_visual_review':'PENDING_BROWSER_COMPOSITES'})
bg=Path('assets/backgrounds/chapter_one.png');assert hashlib.sha256(bg.read_bytes()).hexdigest()=='a57d2a4c7830e511561e2d2fe9cc60a62b26b4a16023f5d579480ba3f6f7227a'
Path('tasks/FIRST_LEVEL_CONTENT_001/evidence/asset-report.json').write_text(json.dumps({'assets':out,'background_unchanged':True,'source':'original desktop bytes; no export/regeneration/cropping'},indent=2)+'\n');print(json.dumps(out[0],indent=2))
