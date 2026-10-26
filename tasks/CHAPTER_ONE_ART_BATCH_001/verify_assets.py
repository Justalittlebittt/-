"""Read approved originals without re-encoding; generate diagnostic evidence only."""
from pathlib import Path
import hashlib,json,shutil
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parents[2]
TASK=Path(__file__).parent
SOURCE=Path('C:/Users/Administrator/Desktop/动物拼图美术素材')
NAMES={'U5':('蛇.png','snake_u5_final_g3.png'),'S4':('松鼠.png','squirrel_s4_clean_g3.png'),'T4':('猫头鹰.png','owl_t4_wide_g3.png')}
handoff=json.loads((TASK/'handoff_art_to_design.json').read_text(encoding='utf-8-sig'))
out=TASK/'evidence';out.mkdir(exist_ok=True)
records=[]
sheet=Image.new('RGB',(1440,1080),'#e7dfcb');sd=ImageDraw.Draw(sheet)
for row,a in enumerate(handoff['assets']):
 sid=a['shape_id'];local,target=NAMES[sid];src=SOURCE/local
 if not src.exists():raise SystemExit('ASSET_LOCAL_MISSING '+str(src))
 data=src.read_bytes();digest=hashlib.sha256(data).hexdigest()
 assert digest==a['image_sha256'] and len(data)==a['bytes'],sid+' APPROVED_VERSION_MISMATCH'
 assert data.startswith(b'\x89PNG\r\n\x1a\n')
 im=Image.open(src);im.load();assert im.mode=='RGBA' and im.size==(a['width'],a['height'])
 alpha=im.getchannel('A');hist=alpha.histogram();bbox=alpha.getbbox()
 edge=list(alpha.crop((0,0,im.width,1)).getdata())+list(alpha.crop((0,im.height-1,im.width,im.height)).getdata())+list(alpha.crop((0,0,1,im.height)).getdata())+list(alpha.crop((im.width-1,0,im.width,im.height)).getdata())
 dst=ROOT/'assets/animals'/target;shutil.copyfile(src,dst);assert dst.read_bytes()==data
 # Full source rectangle, uniform contain in 3x2; never crop or deform an animal.
 cell=200;scale=min(3*cell/im.width,2*cell/im.height);size=(round(im.width*scale),round(im.height*scale));offset=((3*cell-size[0])//2,(2*cell-size[1])//2)
 sprite=Image.new('RGBA',(600,400));sprite.alpha_composite(im.resize(size,Image.Resampling.LANCZOS),offset)
 cells=set(map(tuple,a['occupied_cells']));coverage=[]
 for y in range(2):
  for x in range(3):
   h=sprite.getchannel('A').crop((x*cell,y*cell,(x+1)*cell,(y+1)*cell)).histogram()
   coverage.append({'cell':[x,y],'occupied':(x,y) in cells,'alpha_gt_60_fraction':round(sum(h[61:])/cell**2,4),'alpha_gt_200_fraction':round(sum(h[201:])/cell**2,4),'alpha_weighted_fraction':round(sum(i*n for i,n in enumerate(h))/(255*cell**2),4)})
 for rot in range(4):
  s=sprite.rotate(-90*rot,expand=True);s.thumbnail((326,296),Image.Resampling.LANCZOS)
  tile=Image.new('RGBA',(600,400),'#edf1e8');d=ImageDraw.Draw(tile)
  for y in range(2):
   for x in range(3):
    d.rectangle((x*cell,y*cell,(x+1)*cell-1,(y+1)*cell-1),fill=('#c7dfb4' if (x,y) in cells else '#da92a6'),outline='#374e45',width=3)
  tile.alpha_composite(sprite);tile=tile.rotate(-90*rot,expand=True);tile.thumbnail((326,296),Image.Resampling.LANCZOS)
  px=rot*360+(360-tile.width)//2;py=row*360+42+(306-tile.height)//2
  sheet.paste(tile.convert('RGB'),(px,py));sd.text((rot*360+12,row*360+10),sid+' rotation '+str(rot*90)+' deg',fill='#233c33')
  tile.convert('RGB').save(out/(sid+'-rotation-'+str(rot)+'.png'))
 # Alpha compositing over three backgrounds at actual-size approximation.
 edge_sheet=Image.new('RGB',(900,240));thumb=im.copy();thumb.thumbnail((290,220),Image.Resampling.LANCZOS)
 for j,color in enumerate(['#ffffff','#162d35','#da87b0']):
  bg=Image.new('RGBA',(300,240),color);bg.alpha_composite(thumb,((300-thumb.width)//2,(240-thumb.height)//2));edge_sheet.paste(bg.convert('RGB'),(300*j,0))
 edge_sheet.save(out/(sid+'-edges.png'))
 records.append({'shape_id':sid,'version':a['asset_version'],'source':str(src),'handoff_filename':a['filename'],'repository_file':dst.relative_to(ROOT).as_posix(),'sha256':digest,'bytes':len(data),'dimensions':im.size,'mode':im.mode,'alpha_range':alpha.getextrema(),'transparent_pixels':hist[0],'semi_transparent_pixels':sum(hist[1:255]),'opaque_pixels':hist[255],'alpha_bbox':bbox,'canvas_border_alpha_max':max(edge),'occupied_cells':a['occupied_cells'],'mapping':'full original image uniformly contained and centered within 3x2 cell bounding box; no source pixel modification','cell_coverage':coverage,'G3':a['G3']})
sheet.save(out/'four-rotation-overlays.png')
(TASK/'asset-report.json').write_text(json.dumps({'status':'EXACT_FINAL_ORIGINALS_PRESENT','assets':records},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(records,ensure_ascii=False,indent=2))
