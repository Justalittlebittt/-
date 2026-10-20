"""TECH_FIXTURES_001: dependency-free synthetic B1 checks; Python 3 standard library."""
import json,struct,zlib,pathlib
OUT=pathlib.Path(__file__).parent/'evidence';OUT.mkdir(exist_ok=True)
def normalize(c):
 if not c:raise ValueError('EMPTY')
 if any(len(p)!=2 or any(type(x)!=int for x in p) for p in c):raise ValueError('NON_INTEGER')
 if len(set(map(tuple,c)))!=len(c):raise ValueError('DUPLICATE')
 x=min(p[0] for p in c);y=min(p[1] for p in c)
 c=sorted(((a-x,b-y) for a,b in c),key=lambda p:(p[1],p[0]))
 seen={c[0]};todo=[c[0]];s=set(c)
 for a,b in todo:
  for q in ((a+1,b),(a-1,b),(a,b+1),(a,b-1)):
   if q in s and q not in seen:seen.add(q);todo.append(q)
 if len(seen)!=len(c):raise ValueError('DISCONNECTED')
 return c
def rotate(c,angle):
 if angle not in (0,90,180,270):raise ValueError('ANGLE')
 return normalize([(a,b) if angle==0 else (-b,a) if angle==90 else (-a,-b) if angle==180 else (b,-a) for a,b in normalize(c)])
def anchored(c,angle,x,y):
 if type(x)!=int or type(y)!=int:raise ValueError('ANCHOR')
 return [(a+x,b+y) for a,b in rotate(c,angle)]
def classify(p):
 a=p[3::4]
 return {'opaque':a.count(255),'clear':a.count(0),'partial':sum(v not in (0,255) for v in a),'transparent_rgb':sum(any(p[i:i+3]) for i in range(0,len(p),4) if p[i+3]==0),'has_alpha':any(v!=255 for v in a)}
def straight(l,r):return tuple(round((a+b)/2) for a,b in zip(l,r))
def premul(l,r):
 a=l[3]+r[3]
 return tuple(round((l[i]*l[3]+r[i]*r[3])/a) if a else 0 for i in range(3))+(round(a/2),)
def chunk(t,d):return struct.pack('>I',len(d))+t+d+struct.pack('>I',zlib.crc32(t+d)&0xffffffff)
def savepng(p,name):
 raw=b'\x00'+bytes(p);header=struct.pack('>IIBBBBB',len(p)//4,1,8,6,0,0,0)
 (OUT/(name+'.png')).write_bytes(b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',header)+chunk(b'IDAT',zlib.compress(raw))+chunk(b'IEND',b''))
def reject(fn,code):
 try:fn()
 except ValueError as exc:
  assert str(exc)==code,(str(exc),code);return
 raise AssertionError('Expected '+code)
def run():
 tests=[]
 def verify(name,condition):
  assert condition,name
  tests.append(name)
 reject(lambda:normalize([]),'EMPTY');tests.append('empty_rejection')
 reject(lambda:normalize([(0,0),(0,0)]),'DUPLICATE');tests.append('duplicate_rejection')
 reject(lambda:normalize([(0,.5)]),'NON_INTEGER');tests.append('integer_rejection')
 verify('negative_normalization',normalize([(-3,-5),(-2,-5)])==[(0,0),(1,0)])
 shapes={'L':[(0,0),(1,0),(1,1)],'bar':[(0,0),(0,1),(0,2)],'square':[(0,0),(1,0),(0,1),(1,1)]}
 for name,c in shapes.items():verify('valid_'+name,len(normalize(c))==len(c))
 reject(lambda:normalize([(0,0),(2,0)]),'DISCONNECTED');tests.append('disconnect_rejection')
 c=shapes['L']
 for a in (0,90,180,270):verify('inverse_'+str(a),rotate(rotate(c,a),(360-a)%360)==normalize(c))
 x=c
 for _ in range(4):x=rotate(x,90)
 verify('four_turn_closure',x==normalize(c))
 reject(lambda:rotate(c,45),'ANGLE');tests.append('invalid_angle')
 verify('anchor',anchored([(0,0),(1,0)],90,4,5)==[(4,5),(4,6)])
 reject(lambda:anchored(c,0,.5,0),'ANCHOR');tests.append('invalid_anchor')
 samples={'fake_alpha':(220,140,65,255,240,210,170,255),'hard_edge':(190,90,20,255,0,0,0,0),'antialias':(190,90,20,255,190,90,20,128,0,0,0,0),'detached':(220,130,60,255,0,0,0,0,0,0,0,0,220,130,60,255),'black_contamination':(200,100,40,255,0,0,0,0),'white_contamination':(200,100,40,255,255,255,255,0),'clean_foreground':(200,100,40,255,200,100,40,0)}
 for name,p in samples.items():savepng(p,name)
 verify('fake_alpha',not classify(samples['fake_alpha'])['has_alpha'])
 verify('partial_alpha',classify(samples['antialias'])['partial']==1)
 verify('detached_component',classify(samples['detached'])['opaque']==2)
 verify('transparent_rgb',classify(samples['white_contamination'])['transparent_rgb']==1)
 left=(200,100,40,255)
 for name,edge in {'black':(0,0,0,0),'white':(255,255,255,0),'clean':(200,100,40,0)}.items():
  for mode,fn in (('straight',straight),('premul',premul)):savepng(fn(left,edge)*12,mode+'_'+name)
  verify('premul_edge_'+name,premul(left,edge)[:3]==left[:3])
 report={'task_id':'TECH_FIXTURES_001','verdict':'PASS_SYNTHETIC_B1_ONLY','coordinate_convention':'x right y down; 90 degrees clockwise, normalized bounding box; anchor after rotation','tests':tests,'passed':len(tests),'samples':{k:classify(v) for k,v in samples.items()},'limitations':['Transparent RGB flag not proof of black/white background contamination','Disconnected opaque parts cannot automatically be judged erroneous','No real animal asset or engine; G1/G2/G4 NOT_RUN','cell_px and final resampling algorithm remain undecided']}
 (OUT/'test_report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps({'verdict':report['verdict'],'passed':len(tests),'pngs':len(list(OUT.glob('*.png')))}))
if __name__=='__main__':run()
