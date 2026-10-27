"""Audit pinned whole PNG intake. Only evidence is rendered; source bytes are copied intact."""
from pathlib import Path
import argparse,hashlib,json,shutil
from PIL import Image,ImageDraw
parser=argparse.ArgumentParser();parser.add_argument('intake');args=parser.parse_args()
ROOT=Path(__file__).resolve().parents[2];spec=ROOT/args.intake;task=spec.parent
data=json.loads(spec.read_text(encoding='utf-8'));evidence=task/'evidence';evidence.mkdir(exist_ok=True)
sheet=Image.new('RGB',(1440,360*len(data['assets'])),'#eee7d6');sd=ImageDraw.Draw(sheet);records=[]
for row,a in enumerate(data['assets']):
 src=Path(data['source_root'])/a['filename']
 if not src.is_file():raise SystemExit('ASSET_LOCAL_MISSING '+str(src))
 raw=src.read_bytes();digest=hashlib.sha256(raw).hexdigest();assert digest==a['image_sha256'] and len(raw)==a['bytes']
 assert raw.startswith(b'\x89PNG\r\n\x1a\n');im=Image.open(src);im.load();assert im.mode=='RGBA' and im.size==(a['width'],a['height'])
 alpha=im.getchannel('A');hist=alpha.histogram();assert hist[0]>0 and sum(hist[61:])>0
 border=max(alpha.crop(r).getextrema()[1] for r in [(0,0,im.width,1),(0,im.height-1,im.width,im.height),(0,0,1,im.height),(im.width-1,0,im.width,im.height)])
 dest=ROOT/a['repository_file']
 if src.resolve()!=dest.resolve():shutil.copyfile(src,dest)
 assert dest.read_bytes()==raw
 # Non-destructive source registration: rotate the whole canvas; keep all image pixels.
 turn=a.get('baseRotation',0);rotated=im.rotate(-90*turn,expand=True)
 x0,y0,x1,y1=a['sourceBounds'];corners=[(x0,y0),(x1,y0),(x0,y1),(x1,y1)];iw,ih=im.size
 for n in range(turn):corners=[(ih-y,x) for x,y in corners];iw,ih=ih,iw
 bx0=min(c[0] for c in corners);by0=min(c[1] for c in corners);bx1=max(c[0] for c in corners);by1=max(c[1] for c in corners)
 unit=200;w,h=a['baseSize'];scale=min(w*unit/(bx1-bx0),h*unit/(by1-by0))
 sprite=Image.new('RGBA',(w*unit,h*unit));whole=rotated.resize((round(rotated.width*scale),round(rotated.height*scale)),Image.Resampling.LANCZOS)
 dx,dy=a.get('offsetCells',[0,0])
 sprite.alpha_composite(whole,(round(w*unit/2-(bx0+bx1)*scale/2+dx*unit),round(h*unit/2-(by0+by1)*scale/2+dy*unit)))
 keys=set(map(tuple,a['occupied_cells']));coverage=[]
 for y in range(h):
  for x in range(w):
   patch=sprite.getchannel('A').crop((x*unit,y*unit,(x+1)*unit,(y+1)*unit));ph=patch.histogram()
   coverage.append({'cell':[x,y],'occupied':(x,y) in keys,'alpha_gt60_fraction':round(sum(ph[61:])/unit**2,5),'center_alpha':patch.getpixel((unit//2,unit//2))})
 grid=Image.new('RGBA',sprite.size);gd=ImageDraw.Draw(grid)
 for y in range(h):
  for x in range(w):gd.rectangle((x*unit,y*unit,(x+1)*unit-1,(y+1)*unit-1),fill=('#c7dfb4' if (x,y) in keys else '#da92a6'),outline='#374e45',width=3)
 grid.alpha_composite(sprite)
 for rot in range(4):
  tile=grid.rotate(-90*rot,expand=True);tile.thumbnail((326,296),Image.Resampling.LANCZOS);tile.convert('RGB').save(evidence/(a['shape_id']+'-rotation-'+str(rot)+'.png'))
  sheet.paste(tile.convert('RGB'),(rot*360+(360-tile.width)//2,row*360+42+(306-tile.height)//2));sd.text((rot*360+12,row*360+10),a['shape_id']+' rotation '+str(rot*90),fill='#233c33')
 edge=Image.new('RGB',(900,260));thumb=im.copy();thumb.thumbnail((290,240),Image.Resampling.LANCZOS)
 for j,color in enumerate(['white','#162d35','#da87b0']):
  bg=Image.new('RGBA',(300,260),color);bg.alpha_composite(thumb,((300-thumb.width)//2,(260-thumb.height)//2));edge.paste(bg.convert('RGB'),(300*j,0))
 edge.save(evidence/(a['shape_id']+'-edges.png'))
 records.append({**a,'sha256':digest,'source':str(src),'alpha_range':alpha.getextrema(),'transparent_pixels':hist[0],'semi_transparent_pixels':sum(hist[1:255]),'canvas_border_alpha_max':border,'alpha_bbox60':alpha.point(lambda v:255 if v>60 else 0).getbbox(),'cell_coverage':coverage,'pixel_changes':False,'registration':'Source bounds define scaling/anchor only; whole PNG is rendered once, no cropped source rectangle'})
sheet.save(evidence/'four-rotation-overlays.png')
(task/'asset-report.json').write_text(json.dumps({'status':'EXACT_PINNED_DESKTOP_ORIGINALS_IMPORTED','assets':records},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps([{a['shape_id']:a['cell_coverage'],'alpha':a['alpha_range'],'border':a['canvas_border_alpha_max']} for a in records]))
