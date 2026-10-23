'use strict';
const C=document.getElementById('game'),ctx=C.getContext('2d'),next=document.getElementById('next');
const img=new Image(),environment=new Image();
img.src=pandaAsset.src;environment.src=firstScene.background;
const step=firstScene.step,cell=firstScene.cell,board=firstScene.board;
// One complete panda, one atomic object. The background's 5x4 grid is a placement area.
const sceneLevel={w:board.w,h:board.h};
let index=0,pieces=[],held=null,selection=null,mouse={x:0,y:0};
function shape(p){return PuzzleCore.rotate(p.base,p.rot*90);}
function dims(a){return [Math.max(...a.map(q=>q[0]))+1,Math.max(...a.map(q=>q[1]))+1]}
function legal(p,at){if(!Array.isArray(at)||at.length!==2||!at.every(Number.isInteger))return false;let l=sceneLevel,used=new Set();for(let q of pieces){if(q===p||!q.at)continue;for(let [x,y] of shape(q))used.add((x+q.at[0])+':'+(y+q.at[1]));}for(let [x,y] of shape(p)){let a=x+at[0],b=y+at[1];if(a<0||b<0||a>=l.w||b>=l.h||used.has(a+':'+b))return false;}return true;}
function local(e){let r=C.getBoundingClientRect();return {x:(e.clientX-r.left)*C.width/r.width,y:(e.clientY-r.top)*C.height/r.height};}

function tray(p){const [w,h]=dims(shape(p));return {x:firstScene.trayCenter.x-w*step/2,y:firstScene.trayCenter.y-h*step/2};}
function position(p){return p.at?{x:board.x+p.at[0]*step,y:board.y+p.at[1]*step}:tray(p);}
function locate(v){for(const p of pieces){const o=position(p);if(shape(p).some(([x,y])=>v.x>=o.x+x*step&&v.x<o.x+x*step+step&&v.y>=o.y+y*step&&v.y<o.y+y*step+step))return p;}return null;}
function drawPiece(p,x,y){if(!img.naturalWidth)return;const [w,h]=dims(shape(p));ctx.save();ctx.translate(x+w*step/2,y+h*step/2);ctx.rotate(p.rot*Math.PI/2);ctx.drawImage(img,-3*step/2,-2*step/2,3*step,2*step);ctx.restore();}
function complete(){return !held&&pieces.every(p=>p.at&&legal(p,p.at));}
function draw(){ctx.clearRect(0,0,C.width,C.height);if(environment.naturalWidth)ctx.drawImage(environment,0,0,C.width,C.height);for(const p of pieces){if(held?.p===p)continue;const v=position(p);drawPiece(p,v.x,v.y);}if(held)drawPiece(held.p,mouse.x-held.offset.x,mouse.y-held.offset.y);next.hidden=!complete();}
function release(){const id=held?.pointerId;held=null;if(id!==undefined&&C.hasPointerCapture(id))C.releasePointerCapture(id);}
function cancel(){if(!held)return;held.p.at=held.origin;held.p.rot=held.originRot;release();draw();}
function reset(){cancel();const base=levels[0].blocks[0];pieces=[{id:base.id,kind:base.kind,base:base.cells,rot:0,at:null}];selection=null;draw();}
function rotate(p=held?.p||selection){if(!p)return;const old=p.rot,[w,h]=dims(shape(p));p.rot=(p.rot+1)%4;if(p.at&&!legal(p,p.at))p.rot=old;else if(held)held.offset={x:h*step-held.offset.y,y:held.offset.x};draw();}
C.addEventListener('contextmenu',e=>e.preventDefault());
C.addEventListener('pointerdown',e=>{
 if(e.button===2){e.preventDefault();rotate(held?.p||locate(local(e)));return;}
 if(e.button!==0||held)return;const v=local(e),p=locate(v);if(!p)return;const o=position(p);
 held={p,origin:p.at?[...p.at]:null,originRot:p.rot,pointerId:e.pointerId,offset:{x:v.x-o.x,y:v.y-o.y}};
 p.at=null;selection=p;mouse=v;C.setPointerCapture(e.pointerId);draw();
});
// While the left button remains down, right-button changes are reported as pointermove.
C.addEventListener('mousedown',e=>{if(e.button===2&&held){e.preventDefault();rotate();}});
C.addEventListener('pointermove',e=>{if(held&&e.pointerId===held.pointerId){mouse=local(e);draw();}});
C.addEventListener('pointerup',e=>{
 if(!held||e.button!==0||e.pointerId!==held.pointerId)return;const v=local(e),p=held.p;
 const at=[Math.round((v.x-held.offset.x-board.x)/step),Math.round((v.y-held.offset.y-board.y)/step)];
 const inside=v.x>=board.x&&v.x<board.x+board.w*step&&v.y>=board.y&&v.y<board.y+board.h*step;
 if(inside&&legal(p,at))p.at=at;else if(!inside)p.at=null;else{p.at=held.origin;p.rot=held.originRot;}
 release();draw();
});
C.addEventListener('pointercancel',cancel);C.addEventListener('lostpointercapture',cancel);window.addEventListener('blur',cancel);
window.addEventListener('resize',cancel);
document.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='r'&&!e.repeat){e.preventDefault();reset();}});
// Only level one is in scope. The button exposes a next-level hook, without inventing level two.
next.onclick=()=>{if(complete())C.dispatchEvent(new CustomEvent('nextlevelrequest',{bubbles:true}));};
img.onload=draw;environment.onload=draw;reset();
