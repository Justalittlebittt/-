"""B2 standalone synthetic two-dimensional sprite/grid and RGBA regression (stdlib)."""
import sys,json,pathlib,struct,zlib,math
sys.path.insert(0,str(pathlib.Path(__file__).parents[1]/"TECH_FIXTURES_001"))
from fixtures import normalize,rotate
ROOT=pathlib.Path(__file__).parent
OUT=ROOT/"evidence";OUT.mkdir(exist_ok=True)
C=8
def rotate_pos(x,y,w,h,a):
 if a==0:return (x,y)
 if a==90:return (h-1-y,x)
 if a==180:return (w-1-x,h-1-y)
 if a==270:return (y,w-1-x)
 raise ValueError("ANGLE")
def dims(w,h,a):return (h,w) if a in (90,270) else (w,h)
def transform(cells,angle,origin):
 c=normalize(cells);w=max(x for x,y in c)+1;h=max(y for x,y in c)+1
 out={rotate_pos(x,y,w,h,angle) for x,y in c}
 # rotation of a bounding box is a bijection; transformed set is already min-normalized
 assert out==set(rotate(c,angle))
 return {(origin[0]+x,origin[1]+y) for x,y in out},dims(w,h,angle)
def rotate_image(img,w,h,angle):
 nw,nh=dims(w,h,angle);out=[(0,0,0,0)]*(nw*nh)
 for y in range(h):
  for x in range(w):
   nx,ny=rotate_pos(x,y,w,h,angle);out[ny*nw+nx]=img[y*w+x]
 return out,nw,nh
def draw(cells,pad=1):
 cells=normalize(cells);w=max(x for x,y in cells)+1;h=max(y for x,y in cells)+1
 W=w*C;H=h*C;p=[]
 for y in range(H):
  for x in range(W):
   inside=(x//C,y//C) in cells
   if not inside:p.append((0,200,255,0) if (x+y)%2 else (255,0,200,0))
   else:
    edge=(x%C==0 or y%C==0 or x%C==C-1 or y%C==C-1)
    p.append((160,84,210,128 if edge else 255))
 return p,W,H
def png(p,w,h,path):
 assert len(p)==w*h and w>1 and h>1
 def chunk(t,b):return struct.pack(">I",len(b))+t+b+struct.pack(">I",zlib.crc32(t+b)&0xffffffff)
 data=b"".join(b"\\x00"+bytes(v for px in p[y*w:(y+1)*w] for v in px) for y in range(h))
 hdr=struct.pack(">IIBBBBB",w,h,8,6,0,0,0)
 path.write_bytes(b"\\x89PNG\\r\\n\\x1a\\n"+chunk(b"IHDR",hdr)+chunk(b"IDAT",zlib.compress(data))+chunk(b"IEND",b""))
def correct(samples):
 sa=sum(p[3] for p in samples);return tuple(round(sum(p[i]*p[3] for p in samples)/sa) if sa else 0 for i in range(3))+(round(sa/len(samples)),)
def wrong(samples):return tuple(round(sum(p[i] for p in samples)/len(samples)) for i in range(4))
def over(fg,bg):
 a=fg[3]/255
 return tuple(round(fg[i]*a+bg[i]*(1-a)) for i in range(3))
def run():
 tests=[];manifest=[]
 def check(name,cond):
  assert cond,name
  tests.append(name)
 shapes={"concave_L":[(0,0),(1,0),(2,0),(0,1),(0,2)],"thin_hook":[(0,0),(1,0),(2,0),(3,0),(3,1),(3,2),(2,2)]}
 for name,cells in shapes.items():
  p,w,h=draw(cells)
  for angle in (0,90,180,270):
   rp,rw,rh=rotate_image(p,w,h,angle)
   occupied={(x//C,y//C) for y in range(rh) for x in range(rw) if rp[y*rw+x][3]>0}
   expected,bd=transform(cells,angle,(0,0))
   check(name+"_grid_"+str(angle),occupied==expected)
   check(name+"_pixel_bbox_"+str(angle),(rw,rh)==(bd[0]*C,bd[1]*C))
   for origin in ((4,6),(-3,12)):
    absolute,_=transform(cells,angle,origin)
    check(name+"_anchor_"+str(angle)+"_"+str(origin),absolute=={(x+origin[0],y+origin[1]) for x,y in occupied})
   rback,bw,bh=rotate_image(rp,rw,rh,(360-angle)%360)
   check(name+"_inverse_"+str(angle),(bw,bh)==(w,h) and rback==p)
   path=OUT/(name+"_"+str(angle)+".png");png(rp,rw,rh,path);manifest.append(path.name)
 samples=[(200,100,40,255),(0,0,0,0),(255,255,255,0),(200,100,40,128)]
 good=correct(samples);bad=wrong(samples)
 check("2d_premul_keeps_weighted_hue",good[:3]==(200,100,40))
 check("wrong_straight_creates_color_fringe",bad[:3]!=good[:3])
 check("fractional_alpha_preserved",good[3] in (95,96))
 for bgname,bg in {"light":(240,240,240),"dark":(24,24,24),"checker":(180,180,180)}.items():
  check("composite_diff_"+bgname,over(good,bg)!=over(bad,bg))
  for mode,fg in (("correct",good),("incorrect",bad)):
   pixels=[(*over(fg,(245,245,245) if (x//8+y//8)%2==0 else bg),255) for y in range(32) for x in range(48)]
   path=OUT/(bgname+"_"+mode+".png");png(pixels,48,32,path);manifest.append(path.name)
 report={"task":"TECH_FIXTURES_002","status":"PASS_SYNTHETIC_B2_ONLY","passed":len(tests),"png_count":len(manifest),"tests":tests,"png_files":manifest,"coordinate_contract":"screen x right/y down; clockwise 90: (h-1-y,x); rotation about pixel/grid bounding rectangle; normalize min to 0; apply grid origin after rotation; 8 pixels per synthetic cell only","sampling":{"correct":good,"incorrect":bad},"limits":["Transparent RGB is not a reliable background contamination classifier","No real asset or perceptual matting quality asserted","Only exact 90-degree integer rotations; scaling/interpolation of actual sprites not validated","G1/G2/G4 NOT_RUN; no game engine or real animals"]}
 (OUT/"test_report.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\\n")
 print(json.dumps({"status":report["status"],"passed":len(tests),"pngs":len(manifest)}))
if __name__=="__main__":run()
