'use strict';
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage();await page.goto('http://127.0.0.1:8765/experiments/chapter_preview/index.html');await page.evaluate(()=>chapterArtReady);
 const result=await page.evaluate(()=>{
  const p=previewLevels[6].pieces.find(p=>p.shape_id==='S4'),asset=chapterAnimals.S4,offset=[...asset.offsetCells],unit=200,rows=[];
  for(const dx of [0,offset[0]])for(let rot=0;rot<4;rot++){
   asset.offsetCells=[dx,0];p.rot=rot;const [w,h]=G.dims(G.shape(p)),pad=100,c=document.createElement('canvas');c.width=w*unit+pad*2;c.height=h*unit+pad*2;const a=c.getContext('2d');drawAnimal(a,p,pad,pad,unit);const data=a.getImageData(0,0,c.width,c.height).data,keys=new Set(G.shape(p).map(c=>c.join(':'))),empty=[];let outside=0;
   for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)if(data[(y*c.width+x)*4+3]>60&&(x<pad||y<pad||x>=pad+w*unit||y>=pad+h*unit))outside++;
   for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(!keys.has(x+':'+y)){let n=0;for(let yy=0;yy<unit;yy++)for(let xx=0;xx<unit;xx++)if(data[((pad+y*unit+yy)*c.width+pad+x*unit+xx)*4+3]>60)n++;empty.push({cell:[x,y],alpha_gt60_fraction:n/(unit*unit)});}
   rows.push({offset_cells:[dx,0],rotation:rot,empty_cells:empty,outside_bounding_box_alpha_gt60_pixels:outside});
  }
  const c=document.createElement('canvas');c.width=1160;c.height=480;const a=c.getContext('2d');a.fillStyle='#eee7d6';a.fillRect(0,0,c.width,c.height);p.rot=0;
  for(let j=0;j<2;j++){const x=20+j*580,y=100,s=175;a.fillStyle='#233c33';a.font='24px system-ui';a.fillText(j?'After: whole image -0.2 cell':'Before: centered image',x,50);const cells=new Set(p.occupied_cells.map(c=>c.join(':')));for(let yy=0;yy<2;yy++)for(let xx=0;xx<3;xx++){a.fillStyle=cells.has(xx+':'+yy)?'#c7dfb4':'#da92a6';a.fillRect(x+xx*s,y+yy*s,s,s);a.strokeStyle='#374e45';a.strokeRect(x+xx*s,y+yy*s,s,s);}asset.offsetCells=[j?offset[0]:0,0];drawAnimal(a,p,x,y,s);}
  asset.offsetCells=offset;delete p.rot;return {rows,image:c.toDataURL(),offset_cells:offset};
 });
 const before=result.rows.find(r=>r.offset_cells[0]===0&&r.rotation===0).empty_cells.find(c=>c.cell.join(':')==='2:1').alpha_gt60_fraction,after=result.rows.find(r=>r.offset_cells[0]!==0&&r.rotation===0).empty_cells.find(c=>c.cell.join(':')==='2:1').alpha_gt60_fraction;
 assert.ok(after<before);assert.ok(result.rows.filter(r=>r.offset_cells[0]!==0).every(r=>r.outside_bounding_box_alpha_gt60_pixels===0));
 const out=path.join(__dirname,'evidence');fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'before-after.png'),Buffer.from(result.image.split(',')[1],'base64'));delete result.image;
 result.status='PASS_USER_REQUESTED_LOCAL_ANCHOR_SHIFT';result.before_bottom_right_coverage=before;result.after_bottom_right_coverage=after;result.note='Alpha>60 sampling is diagnostic, not an art approval threshold. Exact PNG bytes and logical occupied_cells unchanged.';fs.writeFileSync(path.join(__dirname,'alignment-report.json'),JSON.stringify(result,null,2));console.log(JSON.stringify({before,after,rotations:4,outside_pixels:0}));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
