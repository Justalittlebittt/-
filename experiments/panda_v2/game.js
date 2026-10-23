
'use strict';
const img=new Image();img.src=pandaAsset.src;
const C=document.getElementById('game'),ctx=C.getContext('2d');
let cell=85,step=88;
const environment=new Image();environment.src='../../assets/reference/chapter_one_mood_temporary.png';
environment.onload=()=>draw();
let screen='START';
let index=0,pieces=[],held=null,selection=null,mouse={x:0,y:0},board={x:0,y:0};
function shape(p){return PuzzleCore.rotate(p.base,p.rot*90);}
function dims(a){return [Math.max(...a.map(q=>q[0]))+1,Math.max(...a.map(q=>q[1]))+1]}
function legal(p,at){if(!Array.isArray(at)||at.length!==2||!at.every(Number.isInteger))return false;let l=levels[index],used=new Set();for(let q of pieces){if(q===p||!q.at)continue;for(let [x,y] of shape(q))used.add((x+q.at[0])+':'+(y+q.at[1]));}for(let [x,y] of shape(p)){let a=x+at[0],b=y+at[1];if(a<0||b<0||a>=l.w||b>=l.h||used.has(a+':'+b))return false;}return true;}
function rounded(x,y,w,h,color){ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,8);ctx.fill();}
function drawPiece(p,x,y){let s=shape(p),[w,h]=dims(s);ctx.save();if(p.kind==='panda'&&img.complete&&img.naturalWidth){ctx.translate(x+w*step/2,y+h*step/2);ctx.rotate(p.rot*Math.PI/2);ctx.drawImage(img,-3*step/2,-2*step/2,3*step,2*step);}else{for(let [a,b] of s){rounded(x+a*step+2,y+b*step+2,cell-4,cell-4,p.kind==='panda'?'#f7d7a2':p.id==='B'?'#aed6ed':p.id==='C'?'#c5e6bb':'#edcba5');ctx.fillStyle='#263945';ctx.font='bold '+Math.max(14,step*.28)+'px system-ui';ctx.fillText(p.id,x+a*step+step*.3,y+b*step+step*.6);}}if(selection===p){ctx.restore();ctx.save();ctx.strokeStyle='#e8881c';ctx.lineWidth=3;ctx.strokeRect(x-2,y-2,w*step,h*step);}ctx.restore();}
function draw(){
 const l=levels[index];ctx.clearRect(0,0,C.width,C.height);
 ctx.fillStyle='#e9ead6';ctx.fillRect(0,0,C.width,C.height);
 // Only scenery outside the baked board/title is sampled; central UI is never sampled.
 if(environment.naturalWidth){ctx.globalAlpha=.5;ctx.drawImage(environment,0,0,475,941,0,0,board.x-18,C.height);ctx.drawImage(environment,1200,0,472,941,board.x+l.w*step+18,0,C.width-board.x-l.w*step-18,C.height);ctx.globalAlpha=1;}
 rounded(board.x-12,board.y-12,l.w*step+24,l.h*step+24,'#7a6651');
 for(let y=0;y<l.h;y++)for(let x=0;x<l.w;x++)rounded(board.x+x*step,board.y+y*step,cell,cell,'#fff9ea');
 ctx.font='bold 15px system-ui';ctx.fillStyle='#283c32';ctx.fillText(sideMax[0]?'等待入园 ↕ 滚轮':'等待入园',16,25);ctx.fillText(sideMax[1]?'等待入园 ↕ 滚轮':'等待入园',C.width-sideWidth+12,25);
 for(const p of pieces){if(held&&p===held.p)continue;ctx.save();if(!p.at){ctx.beginPath();ctx.rect(pieces.indexOf(p)%2===0?0:C.width-sideWidth,36,sideWidth,C.height-36);ctx.clip();}drawPiece(p,p.at?board.x+p.at[0]*step:p.tray.x,p.at?board.y+p.at[1]*step:p.tray.y);ctx.restore();}
 if(held){const x=mouse.x-held.offset.x,y=mouse.y-held.offset.y;const at=[Math.round((x-board.x)/step),Math.round((y-board.y)/step)];const ok=legal(held.p,at);ctx.fillStyle=ok?'#217b5366':'#ad343466';for(const [a,b] of shape(held.p)){const px=board.x+(at[0]+a)*step,py=board.y+(at[1]+b)*step;if(px>=board.x&&py>=board.y&&px<board.x+l.w*step&&py<board.y+l.h*step)ctx.fillRect(px,py,cell,cell);}ctx.globalAlpha=.85;drawPiece(held.p,x,y);ctx.globalAlpha=1;document.getElementById('preview').textContent=ok?'✓ 可以放置':'× 此处不可放置';}
 else document.getElementById('preview').textContent='';
}
function local(e){let r=C.getBoundingClientRect();return {x:(e.clientX-r.left)*C.width/r.width,y:(e.clientY-r.top)*C.height/r.height};}
function locate(v){for(let j=pieces.length-1;j>=0;j--){let p=pieces[j];if(!p.at&&(v.y<36||v.y>C.height))continue;let x=p.at?board.x+p.at[0]*step:p.tray.x,y=p.at?board.y+p.at[1]*step:p.tray.y;for(let [a,b] of shape(p))if(v.x>=x+a*step&&v.x<x+a*step+cell&&v.y>=y+b*step&&v.y<y+b*step+cell)return p;}return null;}
function start(i){index=i;sideScroll.fill(0);pieces=levels[i].blocks.map((p,j)=>({id:p.id,kind:p.kind,base:p.cells,rot:0,at:null,tray:{x:0,y:0}}));held=null;selection=null;screen=i<2?'TUTORIAL':'PLAY';layoutTray();document.getElementById('progress').textContent='第 '+(i+1)+' / '+levels.length+' 关';document.getElementById('tutorial').textContent=i===0?'① 拖动熊猫填满棋盘。拖出棋盘可取回。':i===1?'② 点击选择动物，按 R 或下方按钮旋转；填满棋盘即可过关。':'自由摆放，遇到死局可取回动物或重置本关。';document.getElementById('next').disabled=true;document.getElementById('next').textContent=i===levels.length-1?'完成章节':'下一关';document.getElementById('message').textContent='第 '+(i+1)+' / '+levels.length+' 关';document.getElementById('done').style.display='none';draw();}
let sideWidth=0;
const sideScroll=[0,0],sideMax=[0,0];
function layoutTray(){
 const l=levels[index],r=C.getBoundingClientRect();C.width=Math.max(320,Math.round(r.width));C.height=Math.max(260,Math.round(r.height));
 // Reserve each piece's largest rotation envelope, balancing by count between sides.
 const left=pieces.filter((p,i)=>i%2===0),right=pieces.filter((p,i)=>i%2===1);
 const extent=p=>Math.max(...dims(p.base));
 const sideCells=Math.max(1,...pieces.map(extent));
 const rows=Math.max(left.length,right.length,1);
 step=Math.floor(Math.min(88,(C.width-72)/(l.w+2*sideCells+1),(C.height-66)/Math.max(l.h,rows*(sideCells+.45))));
 step=Math.max(28,step);cell=step-3;sideWidth=(C.width-l.w*step)/2-22;
 board.x=(C.width-l.w*step)/2;board.y=(C.height-l.h*step)/2;
 for(const [side,list] of [[0,left],[1,right]]){const slot=Math.max((C.height-48)/Math.max(1,list.length),sideCells*step+12);sideMax[side]=Math.max(0,slot*list.length-(C.height-48));sideScroll[side]=Math.max(0,Math.min(sideScroll[side],sideMax[side]));list.forEach((p,j)=>{const [w,h]=dims(shape(p));p.tray={x:side===0?(sideWidth-w*step)/2+6:C.width-sideWidth+(sideWidth-w*step)/2-6,y:42+j*slot+(slot-h*step)/2-sideScroll[side]};});}
}
function complete(){return !held&&pieces.every(p=>p.at&&legal(p,p.at))&&pieces.reduce((n,p)=>n+p.base.length,0)===levels[index].w*levels[index].h;}
function feedback(text){const done=complete();if(done)screen='LEVEL_COMPLETE';else if(screen!=='START')screen=index<2?'TUTORIAL':'PLAY';document.getElementById('next').disabled=!done;document.getElementById('message').textContent=text||(done?'本关完成':'第 '+(index+1)+' / '+levels.length+' 关');if(!done)document.getElementById('done').style.display='none';}
function release(){const id=held?.pointerId;held=null;if(id!==undefined&&C.hasPointerCapture(id))C.releasePointerCapture(id);}
function cancel(){if(!held)return;held.p.at=held.origin;held.p.rot=held.originRot;release();layoutTray();feedback('拖动已取消，恢复原位置');draw();}
C.addEventListener('pointerdown',e=>{
 if(e.button!==0||held||screen==='START'||screen==='CHAPTER_COMPLETE')return;const v=local(e),p=locate(v);if(!p)return;
 const x=p.at?board.x+p.at[0]*step:p.tray.x,y=p.at?board.y+p.at[1]*step:p.tray.y;
 held={p,origin:p.at?[...p.at]:null,originRot:p.rot,pointerId:e.pointerId,offset:{x:v.x-x,y:v.y-y}};
 p.at=null;selection=p;mouse=v;C.setPointerCapture(e.pointerId);feedback();draw();
});
C.addEventListener('pointermove',e=>{if(held&&e.pointerId===held.pointerId){mouse=local(e);draw();}});
C.addEventListener('pointerup',e=>{
 if(!held||e.pointerId!==held.pointerId)return;
 const v=local(e),p=held.p,at=[Math.round((v.x-held.offset.x-board.x)/step),Math.round((v.y-held.offset.y-board.y)/step)];
 const inside=v.x>=board.x&&v.x<board.x+levels[index].w*step&&v.y>=board.y&&v.y<board.y+levels[index].h*step;
 let text;
 if(inside&&legal(p,at))p.at=at;
 else if(!inside){p.at=null;text='已取回待放置区';}
 else{p.at=held.origin;p.rot=held.originRot;text='不能放置：越界或与其他拼块重叠，已恢复';}
 release();layoutTray();feedback(text);draw();
});
C.addEventListener('pointercancel',cancel);
C.addEventListener('lostpointercapture',cancel);
window.addEventListener('blur',cancel);
function rotate(){
 const p=held?.p||selection;if(!p)return;
 const old=p.rot,oldDims=dims(shape(p));p.rot=(p.rot+1)%4;
 if(p.at&&!legal(p,p.at)){p.rot=old;feedback('不能旋转：越界或与其他拼块重叠');}
 else{if(held){held.offset={x:oldDims[1]*step-held.offset.y,y:held.offset.x};}else layoutTray();feedback();}
 draw();
}
document.getElementById('rotate').onclick=rotate;
document.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='r'){e.preventDefault();rotate();}});
document.getElementById('reset').onclick=()=>{cancel();start(index);};
document.getElementById('restart').onclick=()=>{cancel();document.getElementById('intro').hidden=false;screen='START';document.getElementById('done').style.display='none';};
document.getElementById('begin').onclick=()=>{document.getElementById('intro').hidden=true;start(0);};
document.getElementById('next').onclick=()=>{if(!complete())return;if(index===levels.length-1){screen='CHAPTER_COMPLETE';document.getElementById('done').style.display='flex';document.getElementById('next').disabled=true;}else start(index+1);};
img.onload=()=>{document.getElementById('asset-status').textContent='已载入你已验收的熊猫素材';draw();};
img.onerror=()=>{document.getElementById('asset-status').textContent='ASSET_LOCAL_MISSING：当前使用占位拼块，正式熊猫美术未验收';draw();};
start(0);screen='START';
new ResizeObserver(()=>{if(held)cancel();layoutTray();draw();}).observe(C);

C.addEventListener('wheel',e=>{if(held)return;const v=local(e);const side=v.x<board.x?0:v.x>board.x+levels[index].w*step?1:-1;if(side>=0&&sideMax[side]>0){e.preventDefault();sideScroll[side]+=e.deltaY;layoutTray();draw();}},{passive:false});
