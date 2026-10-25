'use strict';
const G=PuzzleGeometry,C=document.getElementById('game'),ctx=C.getContext('2d'),next=document.getElementById('next');
const environment=new Image();environment.src='../../assets/backgrounds/chapter_one.png';
environment.onload=()=>draw();
const palette=['#efad69','#8bbbd9','#c9a8d6','#a7c68b','#f0c75e','#e49d9d'];
let levelIndex=0,level=previewLevels[0],pieces=[],held=null,mouse={x:0,y:0},phase='START',step=45,board={x:0,y:0},sideWidth=0;
const scroll=[0,0],maxScroll=[0,0];
function shape(p){return G.shape(p);}
function pos(p){return p.at?{x:board.x+p.at[0]*step,y:board.y+p.at[1]*step}:p.tray;}
function local(e){const r=C.getBoundingClientRect();return {x:(e.clientX-r.left)*C.width/r.width,y:(e.clientY-r.top)*C.height/r.height};}
function layout(){
 C.width=1672;C.height=941;
 const extent=p=>Math.max(...G.dims(p.occupied_cells));
 const groups=[pieces.filter((p,i)=>i%2===0),pieces.filter((p,i)=>i%2===1)];
 const required=Math.max(...groups.map(list=>list.reduce((n,p)=>n+extent(p),0)+Math.max(0,list.length-1)*.25));
 step=Math.floor(Math.min(140,604/level.w,466/level.h,740/required,400/Math.max(...pieces.map(extent))));
 sideWidth=470;board={x:Math.round(838-level.w*step/2),y:Math.round(476-level.h*step/2)};
 groups.forEach((list,side)=>{const total=list.reduce((n,p)=>n+extent(p)*step,0)+Math.max(0,list.length-1)*step*.25;let y=162+(752-total)/2;list.forEach(p=>{const [w,h]=G.dims(shape(p)),slot=extent(p)*step;p.tray={x:Math.round((side?1430:240)-w*step/2),y:Math.round(y+(slot-h*step)/2)};y+=slot+step*.25;});scroll[side]=0;maxScroll[side]=0;});
}
function complete(){return !held&&G.complete(level,pieces);}
function pieceDraw(p,x,y,alpha=1){const cells=shape(p),keys=new Set(cells.map(c=>c.join(':')));ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle=palette[pieces.indexOf(p)%palette.length];ctx.beginPath();for(const [a,b] of cells)ctx.rect(x+a*step,y+b*step,step,step);ctx.fill();ctx.strokeStyle='#314a40';ctx.lineWidth=2;ctx.beginPath();for(const [a,b] of cells){const xx=x+a*step,yy=y+b*step;if(!keys.has([a,b-1].join(':'))){ctx.moveTo(xx,yy);ctx.lineTo(xx+step,yy);}if(!keys.has([a+1,b].join(':'))){ctx.moveTo(xx+step,yy);ctx.lineTo(xx+step,yy+step);}if(!keys.has([a,b+1].join(':'))){ctx.moveTo(xx,yy+step);ctx.lineTo(xx+step,yy+step);}if(!keys.has([a-1,b].join(':'))){ctx.moveTo(xx,yy);ctx.lineTo(xx,yy+step);}}ctx.stroke();const [a,b]=cells[0];ctx.fillStyle='#233c33';ctx.font='bold '+Math.max(16,step*.4)+'px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(p.piece_id,x+(a+.5)*step,y+(b+.5)*step);ctx.restore();}
function draw(){ctx.clearRect(0,0,C.width,C.height);
 if(environment.naturalWidth)ctx.drawImage(environment,0,0,1672,941);else{ctx.fillStyle='#d9e4ce';ctx.fillRect(0,0,1672,941);}
 // This chapter owns a dynamic UI layer. Original approved PNG remains byte-identical.
 // Cover only the baked grid interior, keep the existing wooden frame and scenery.
 const panel=ctx.createLinearGradient(0,231,0,722);panel.addColorStop(0,'#edce9f');panel.addColorStop(1,'#d6ac75');ctx.fillStyle=panel;ctx.fillRect(529,231,622,490);
 const sign=ctx.createLinearGradient(0,86,0,144);sign.addColorStop(0,'#f0cc94');sign.addColorStop(1,'#e7ba7d');ctx.fillStyle=sign;ctx.fillRect(746,87,163,57);ctx.fillStyle='#503016';ctx.font='bold 34px "Microsoft YaHei",system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('第 '+(levelIndex+1)+' 关',829,116);
 ctx.fillStyle='#805f3c';ctx.fillRect(board.x-5,board.y-5,level.w*step+10,level.h*step+10);const blocks=new Set(level.blocked.map(c=>c.join(':')));
 for(let y=0;y<level.h;y++)for(let x=0;x<level.w;x++){const px=board.x+x*step,py=board.y+y*step;ctx.fillStyle=blocks.has(x+':'+y)?'#605344':'#fae2b9';ctx.fillRect(px+1,py+1,step-2,step-2);if(blocks.has(x+':'+y)){ctx.save();ctx.beginPath();ctx.rect(px+1,py+1,step-2,step-2);ctx.clip();ctx.strokeStyle='#9bac9f';ctx.lineWidth=2;for(let n=-step;n<step*2;n+=10){ctx.beginPath();ctx.moveTo(px+n,py);ctx.lineTo(px+n-step,py+step);ctx.stroke();}ctx.restore();}}
 ctx.fillStyle='#476156';ctx.font='13px system-ui';ctx.textAlign='left';ctx.fillText(maxScroll[0]?'↕ 滚轮浏览':'',12,20);ctx.fillText(maxScroll[1]?'↕ 滚轮浏览':'',C.width-sideWidth+6,20);
 for(const p of pieces){if(held?.p===p)continue;const v=pos(p);ctx.save();if(!p.at){ctx.beginPath();ctx.rect(pieces.indexOf(p)%2?C.width-sideWidth:0,28,sideWidth,C.height-28);ctx.clip();}pieceDraw(p,v.x,v.y);ctx.restore();}
 if(held){const x=mouse.x-held.offset.x,y=mouse.y-held.offset.y;const at=[Math.round((x-board.x)/step),Math.round((y-board.y)/step)],ok=G.valid(level,pieces,held.p,at);ctx.fillStyle=ok?'#28744744':'#bc393944';for(const [a,b] of shape(held.p)){const px=board.x+(a+at[0])*step,py=board.y+(b+at[1])*step;if(px>=board.x&&py>=board.y&&px<board.x+level.w*step&&py<board.y+level.h*step)ctx.fillRect(px,py,step,step);}pieceDraw(held.p,x,y,.9);document.getElementById('status').textContent=ok?'✓ 可以放置':'× 此处不可放置';if(!ok){ctx.save();ctx.strokeStyle='#8f2922';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(mouse.x-8,mouse.y-8);ctx.lineTo(mouse.x+8,mouse.y+8);ctx.moveTo(mouse.x+8,mouse.y-8);ctx.lineTo(mouse.x-8,mouse.y+8);ctx.stroke();ctx.restore();}}
 next.hidden=!complete()||phase==='END';if(complete()&&phase!=='END')document.getElementById('status').textContent='本关完成！';}
function begin(i){levelIndex=i;level=previewLevels[i];G.validate(level);pieces=level.pieces.map(p=>({...p,rot:0,at:null,tray:null}));held=null;scroll.fill(0);phase='PLAY';document.getElementById('progress').textContent='第 '+(i+1)+' / '+previewLevels.length+' 关';document.getElementById('status').textContent='左键拖动 · 右键旋转 · R 重置';next.textContent=i===previewLevels.length-1?'完成章节 →':'下一关 →';layout();draw();}
function locate(v){for(let i=pieces.length-1;i>=0;i--){const p=pieces[i],o=pos(p);if(!p.at&&(v.y<28||v.y>=C.height))continue;if(shape(p).some(([x,y])=>v.x>=o.x+x*step&&v.x<o.x+(x+1)*step&&v.y>=o.y+y*step&&v.y<o.y+(y+1)*step))return p;}return null;}
function release(){const id=held?.pointerId;held=null;if(id!==undefined&&C.hasPointerCapture(id))C.releasePointerCapture(id);}
function cancel(){if(!held)return;held.p.at=held.origin;held.p.rot=held.originRot;release();layout();draw();}
function rotate(p=held?.p){if(!p)return;const old=p.rot,[w,h]=G.dims(shape(p));p.rot=(old+1)%4;if(p.at&&!G.valid(level,pieces,p,p.at))p.rot=old;else if(held)held.offset={x:h*step-held.offset.y,y:held.offset.x};if(!held)layout();draw();}
C.addEventListener('contextmenu',e=>{e.preventDefault();if(held)held.contextRotation=true;});
C.addEventListener('pointerdown',e=>{if(phase!=='PLAY')return;if(e.button===2){e.preventDefault();rotate(held?.p||locate(local(e)));return;}if(e.button!==0||held)return;const v=local(e),p=locate(v);if(!p)return;const o=pos(p);held={p,origin:p.at?[...p.at]:null,originRot:p.rot,pointerId:e.pointerId,offset:{x:v.x-o.x,y:v.y-o.y}};p.at=null;mouse=v;C.setPointerCapture(e.pointerId);draw();});
C.addEventListener('mousedown',e=>{if(e.button===2&&held){e.preventDefault();rotate();}});
C.addEventListener('pointermove',e=>{if(held&&e.pointerId===held.pointerId){mouse=local(e);draw();}});
C.addEventListener('pointerup',e=>{if(!held||e.button!==0||e.pointerId!==held.pointerId)return;const p=held.p,v=local(e),at=[Math.round((v.x-held.offset.x-board.x)/step),Math.round((v.y-held.offset.y-board.y)/step)],inside=v.x>=board.x&&v.x<board.x+level.w*step&&v.y>=board.y&&v.y<board.y+level.h*step;if(inside&&G.valid(level,pieces,p,at))p.at=at;else if(!inside)p.at=null;else{p.at=held.origin;p.rot=held.originRot;document.getElementById('status').textContent='× 位置无效，已恢复';}release();layout();draw();});
C.addEventListener('pointercancel',cancel);C.addEventListener('lostpointercapture',e=>{if(held?.contextRotation&&(e.buttons&1)){held.contextRotation=false;C.setPointerCapture(held.pointerId);return;}cancel();});window.addEventListener('blur',cancel);
C.addEventListener('wheel',e=>{if(held)return;const v=local(e),s=v.x<board.x?0:v.x>board.x+level.w*step?1:-1;if(s>=0&&maxScroll[s]){e.preventDefault();scroll[s]+=e.deltaY;layout();draw();}},{passive:false});
function reset(){if(phase!=='PLAY')return;cancel();begin(levelIndex);}
document.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='r'&&!e.repeat){e.preventDefault();reset();}});document.getElementById('reset').onclick=reset;
document.getElementById('begin').onclick=()=>{document.getElementById('intro').hidden=true;begin(0);};
next.onclick=()=>{if(!complete())return;if(levelIndex+1<previewLevels.length)begin(levelIndex+1);else{phase='END';next.hidden=true;document.getElementById('ending').hidden=false;document.getElementById('status').textContent='章节完成';}};
document.getElementById('replay').onclick=()=>{document.getElementById('ending').hidden=true;document.getElementById('intro').hidden=false;begin(0);phase='START';};
begin(0);phase='START';new ResizeObserver(()=>{cancel();layout();draw();}).observe(C);
