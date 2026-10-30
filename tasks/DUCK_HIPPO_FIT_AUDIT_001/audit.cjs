const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{const root=path.resolve(__dirname,'../..');
const server=http.createServer((req,res)=>{const p=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));if(!p.startsWith(root+path.sep)||!fs.existsSync(p)){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',p.endsWith('.js')?'application/javascript':p.endsWith('.css')?'text/css':p.endsWith('.html')?'text/html':'image/png');res.end(fs.readFileSync(p));});
await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
try{browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage();await page.goto(`http://127.0.0.1:${server.address().port}/experiments/chapter_preview/index.html`);await page.evaluate(()=>chapterArtReady);
const data=await page.evaluate(()=>{
const unit=100,margin=70,metrics=[];
function layer(p){const canvas=document.createElement('canvas');canvas.width=canvas.height=440;drawAnimal(canvas.getContext('2d'),p,margin,margin,unit);return canvas;}
function cells(p){return new Set(shape(p).map(c=>c.join(':')));}
const sheet=document.createElement('canvas');sheet.width=1600;sheet.height=1000;const c=sheet.getContext('2d');c.fillStyle='#faf6ed';c.fillRect(0,0,1600,1000);
for(let row=0;row<2;row++)for(let rot=0;rot<4;rot++){
const id=row?'P5':'L3',p={...previewLevels[5].pieces.find(p=>p.shape_id===id),rot},art=layer(p),ac=art.getContext('2d'),pixels=ac.getImageData(0,0,440,440),allowed=cells(p);let count=0,outside=0;const red=ac.createImageData(440,440);
for(let y=0;y<440;y++)for(let x=0;x<440;x++){const k=(y*440+x)*4;if(pixels.data[k+3]<32)continue;count++;if(!allowed.has([Math.floor((x-margin)/unit),Math.floor((y-margin)/unit)].join(':'))){outside++;red.data[k]=255;red.data[k+3]=180;}}
metrics.push({shape_id:id,rotation:rot,visible_pixels:count,outside_occupied_cells_pixels:outside,outside_percent:+(100*outside/count).toFixed(2)});
const ox=rot*400,oy=row*500;c.save();c.translate(ox,oy);c.fillStyle='#302a24';c.font='20px sans-serif';c.fillText(`${id} rotation ${rot*90} / spill ${(100*outside/count).toFixed(1)}%`,15,28);
for(const [x,y]of shape(p)){c.fillStyle='#d6e9ce';c.fillRect(margin+x*unit,margin+y*unit,unit,unit);}c.drawImage(art,0,0);
const spill=document.createElement('canvas');spill.width=spill.height=440;spill.getContext('2d').putImageData(red,0,0);c.drawImage(spill,0,0);
c.strokeStyle='#207439';c.lineWidth=2;for(const [x,y]of shape(p))c.strokeRect(margin+x*unit,margin+y*unit,unit,unit);c.restore();}
// Reconstruct the screenshot's legal right-edge adjacency without changing the runtime.
begin(5);const duck=pieces.find(p=>p.shape_id==='L3'),hippo=pieces.find(p=>p.shape_id==='P5');duck.rot=1;duck.at=[3,0];hippo.rot=2;hippo.at=[3,1];
const legal=G.valid(level,pieces,duck,duck.at)&&G.valid(level,pieces,hippo,hippo.at);
draw();const scene=document.createElement('canvas');scene.width=level.w*step+20;scene.height=level.h*step+20;const sc=scene.getContext('2d');sc.drawImage(C,board.x-10,board.y-10,scene.width,scene.height,0,0,scene.width,scene.height);
const a=document.createElement('canvas'),b=document.createElement('canvas');a.width=b.width=C.width;a.height=b.height=C.height;
for(const [p,target,color]of [[duck,a,'#b7471f'],[hippo,b,'#2765a5']]){const t=target.getContext('2d');drawAnimal(t,p,board.x+p.at[0]*step,board.y+p.at[1]*step,step);sc.strokeStyle=color;sc.lineWidth=3;for(const [x,y]of shape(p))sc.strokeRect(10+(p.at[0]+x)*step,10+(p.at[1]+y)*step,step,step);}
const ap=a.getContext('2d').getImageData(0,0,a.width,a.height).data,bp=b.getContext('2d').getImageData(0,0,b.width,b.height).data;let overlap=0;for(let i=3;i<ap.length;i+=4)if(ap[i]>=32&&bp[i]>=32)overlap++;
return {metrics,legal_adjacent_placement:legal,overlap_pixels:overlap,unit_pixels:step,poses:sheet.toDataURL(),scene:scene.toDataURL()};
});
assert(data.legal_adjacent_placement);for(const key of ['poses','scene']){fs.writeFileSync(path.join(__dirname,key+'.png'),Buffer.from(data[key].split(',')[1],'base64'));delete data[key];}fs.writeFileSync(path.join(__dirname,'metrics.json'),JSON.stringify(data,null,2));console.log(JSON.stringify(data));
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
