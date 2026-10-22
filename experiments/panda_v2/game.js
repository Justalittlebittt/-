
'use strict';
const img=new Image();img.src='../../assets/animals/panda_rect6_v2.png';
const C=document.getElementById('game'),ctx=C.getContext('2d'),cell=85,step=88;
let index=0,pieces=[],held=null,selection=null,mouse={x:0,y:0},board={x:0,y:0};
function shape(p){return PuzzleCore.rotate(p.base,p.rot*90);}
function dims(a){return [Math.max(...a.map(q=>q[0]))+1,Math.max(...a.map(q=>q[1]))+1]}
function legal(p,at){if(!Array.isArray(at)||at.length!==2||!at.every(Number.isInteger))return false;let l=levels[index],used=new Set();for(let q of pieces){if(q===p||!q.at)continue;for(let [x,y] of shape(q))used.add((x+q.at[0])+':'+(y+q.at[1]));}for(let [x,y] of shape(p)){let a=x+at[0],b=y+at[1];if(a<0||b<0||a>=l.w||b>=l.h||used.has(a+':'+b))return false;}return true;}
function rounded(x,y,w,h,color){ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,8);ctx.fill();}
function drawPiece(p,x,y){let s=shape(p),[w,h]=dims(s);ctx.save();if(p.kind==='panda'&&img.complete&&img.naturalWidth){ctx.translate(x+w*step/2,y+h*step/2);ctx.rotate(p.rot*Math.PI/2);ctx.drawImage(img,-3*step/2,-2*step/2,3*step,2*step);}else{for(let [a,b] of s){rounded(x+a*step+2,y+b*step+2,cell-4,cell-4,p.kind==='panda'?'#f7d7a2':p.id==='B'?'#aed6ed':p.id==='C'?'#c5e6bb':'#edcba5');ctx.fillStyle='#263945';ctx.font='bold 23px system-ui';ctx.fillText(p.id,x+a*step+25,y+b*step+50);}}if(selection===p){ctx.restore();ctx.save();ctx.strokeStyle='#e8881c';ctx.lineWidth=3;ctx.strokeRect(x-2,y-2,w*step,h*step);}ctx.restore();}
function draw(){let l=levels[index];ctx.clearRect(0,0,C.width,C.height);board.x=(C.width-l.w*step)/2;board.y=40;rounded(board.x-12,board.y-12,l.w*step+21,l.h*step+21,'#839e89');for(let y=0;y<l.h;y++)for(let x=0;x<l.w;x++)rounded(board.x+x*step,board.y+y*step,cell,cell,'#fff9ea');ctx.font='bold 17px system-ui';ctx.fillStyle='#4f565e';ctx.fillText('待放置动物',40,370);for(let p of pieces){if(held&&p===held.p)continue;drawPiece(p,p.at?board.x+p.at[0]*step:p.tray.x,p.at?board.y+p.at[1]*step:p.tray.y);}if(held){let x=mouse.x-held.offset.x,y=mouse.y-held.offset.y;let at=[Math.round((x-board.x)/step),Math.round((y-board.y)/step)];if(mouse.x>=board.x&&mouse.x<=board.x+l.w*step&&mouse.y>=board.y&&mouse.y<=board.y+l.h*step){ctx.fillStyle=legal(held.p,at)?'#3da86a44':'#df474744';for(let [a,b] of shape(held.p)){let px=board.x+(at[0]+a)*step,py=board.y+(at[1]+b)*step;if(px>=board.x&&py>=board.y&&px<board.x+l.w*step&&py<board.y+l.h*step)ctx.fillRect(px,py,cell,cell);}}ctx.globalAlpha=.83;drawPiece(held.p,x,y);ctx.globalAlpha=1;}}
function local(e){let r=C.getBoundingClientRect();return {x:(e.clientX-r.left)*C.width/r.width,y:(e.clientY-r.top)*C.height/r.height};}
function locate(v){for(let j=pieces.length-1;j>=0;j--){let p=pieces[j],x=p.at?board.x+p.at[0]*step:p.tray.x,y=p.at?board.y+p.at[1]*step:p.tray.y;for(let [a,b] of shape(p))if(v.x>=x+a*step&&v.x<x+a*step+cell&&v.y>=y+b*step&&v.y<y+b*step+cell)return p;}return null;}
function start(i){index=i;pieces=levels[i].blocks.map((p,j)=>({id:p.id,kind:p.kind,base:p.cells,rot:0,at:null,tray:{x:0,y:405}}));layoutTray();held=null;selection=null;document.getElementById('next').disabled=true;document.getElementById('next').textContent=i===2?'完成游戏':'下一关';document.getElementById('message').textContent='第 '+(i+1)+' / 3 关';document.getElementById('done').style.display='none';draw();}
function layoutTray(){
 let x=20,y=405,rowHeight=0;
 for(const p of pieces){let [w,h]=dims(shape(p));if(x+w*step>C.width-20){x=20;y+=rowHeight+20;rowHeight=0;}p.tray={x,y};x+=w*step+20;rowHeight=Math.max(rowHeight,h*step);}
 C.height=Math.max(700,y+rowHeight+20);
}
function complete(){return !held&&pieces.every(p=>p.at&&legal(p,p.at))&&pieces.reduce((n,p)=>n+p.base.length,0)===levels[index].w*levels[index].h;}
function feedback(text){const done=complete();document.getElementById('next').disabled=!done;document.getElementById('message').textContent=text||(done?'本关完成':'第 '+(index+1)+' / 3 关');if(!done)document.getElementById('done').style.display='none';}
function release(){const id=held?.pointerId;held=null;if(id!==undefined&&C.hasPointerCapture(id))C.releasePointerCapture(id);}
function cancel(){if(!held)return;held.p.at=held.origin;held.p.rot=held.originRot;release();layoutTray();feedback('拖动已取消，恢复原位置');draw();}
C.addEventListener('pointerdown',e=>{
 if(e.button!==0||held)return;const v=local(e),p=locate(v);if(!p)return;
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
document.getElementById('restart').onclick=()=>{cancel();start(0);};
document.getElementById('next').onclick=()=>{if(!complete())return;if(index===levels.length-1){document.getElementById('done').style.display='block';document.getElementById('next').disabled=true;}else start(index+1);};
img.onload=()=>{document.getElementById('asset-status').textContent='已载入本地图片；正式验收以哈希及门禁报告为准';draw();};
img.onerror=()=>{document.getElementById('asset-status').textContent='ASSET_LOCAL_MISSING：当前使用占位拼块，正式熊猫美术未验收';draw();};
start(0);
