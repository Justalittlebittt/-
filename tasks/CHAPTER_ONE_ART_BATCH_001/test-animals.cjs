'use strict';
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(__dirname,'../..'),reportDir=path.resolve(process.env.ANIMAL_REPORT_DIR||__dirname),out=path.join(reportDir,'evidence');fs.mkdirSync(out,{recursive:true});
require('../../tools/check-runtime.cjs')(path.join(root,'experiments/chapter_preview/index.html'));
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[],checks=[],rotations=[],overlaps=[];
 page.on('pageerror',e=>errors.push(e.message));const check=(n,b)=>{assert.ok(b,n);checks.push(n);};
 await page.goto(process.env.PREVIEW_TEST_URL||'http://127.0.0.1:8765/experiments/chapter_preview/index.html');
 await page.evaluate(()=>chapterArtReady);await page.waitForFunction(()=>environment.naturalWidth&&Object.values(chapterAnimalImages).every(i=>i.naturalWidth));await page.locator('#begin').click();await page.evaluate(()=>{window.devInputTrace=[];for(const type of ['pointerdown','pointerup','pointercancel','lostpointercapture','gotpointercapture','contextmenu','mousedown','mouseup'])C.addEventListener(type,e=>{devInputTrace.push({type,button:e.button,buttons:e.buttons,id:e.pointerId,held:!!held,context:held?.contextRotation});if(devInputTrace.length>30)devInputTrace.shift();});window.addEventListener('blur',()=>devInputTrace.push({type:'blur'}));});
 async function move(x,y){const r=await page.locator('canvas').boundingBox();await page.mouse.move(r.x+x*r.width/1672,r.y+y*r.height/941,{steps:4});}
 async function pick(id){const v=await page.evaluate(id=>{const p=pieces.find(p=>p.piece_id===id),o=pos(p),c=shape(p)[0];return {x:o.x+(c[0]+.5)*step,y:o.y+(c[1]+.5)*step};},id);await move(v.x,v.y);await page.mouse.down();check('atomic pickup '+id,await page.evaluate(id=>held?.p.piece_id===id,id));}
 async function right(){await page.mouse.down({button:'right'});await page.mouse.up({button:'right'});}
 async function drop(at){const v=await page.evaluate(at=>({x:board.x+at[0]*step+held.offset.x,y:board.y+at[1]*step+held.offset.y}),at);await move(v.x,v.y);await page.mouse.up();}
 for(const sid of await page.evaluate(()=>Object.keys(chapterAnimals)))for(let rot=0;rot<4;rot++){
  await page.evaluate(sid=>begin(previewLevels.findIndex(l=>l.pieces.some(p=>p.shape_id===sid))),sid);const id=await page.evaluate(sid=>pieces.find(p=>p.shape_id===sid).piece_id,sid);
  await pick(id);for(let i=0;i<rot;i++)await right();
  await move(838,480);const follow=await page.evaluate(()=>({held:!!held,mouse:{...mouse},phase,trace:devInputTrace}));const follows=follow.held&&Math.abs(follow.mouse.x-838)<.15&&Math.abs(follow.mouse.y-480)<.15;check('drag follows pointer '+sid+rot+(follows?'':' '+JSON.stringify(follow)),follows);
  const target=await page.evaluate(()=>{for(let y=0;y<level.h;y++)for(let x=0;x<level.w;x++)if(G.valid(level,pieces,held.p,[x,y]))return [x,y];return null;});assert.ok(target);
  await drop(target);check('whole art legal pose '+sid+rot,await page.evaluate(({id,rot,target})=>{const p=pieces.find(p=>p.piece_id===id);return !held&&p.rot===rot&&JSON.stringify(p.at)===JSON.stringify(target)&&pieces.filter(q=>q!==p).every(q=>!q.at);},{id,rot,target}));
  const metric=await page.evaluate(({id,rot})=>{
   const p=pieces.find(p=>p.piece_id===id),[w,h]=G.dims(shape(p)),c=document.createElement('canvas');c.width=w*100;c.height=h*100;const cx=c.getContext('2d');drawAnimal(cx,p,0,0,100);
   const data=cx.getImageData(0,0,c.width,c.height).data,keys=new Set(shape(p).map(c=>c.join(':'))),empty=[];
   for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(!keys.has(x+':'+y)){const a=data[((y*100+50)*c.width+x*100+50)*4+3];empty.push({cell:[x,y],center_alpha:a});}
   let wholeCalls=0,partialCalls=0;const spy={save(){},restore(){},translate(){},rotate(){},drawImage(...args){if(args.length===5&&args[0]===chapterAnimalImages[p.shape_id])wholeCalls++;else partialCalls++;}};drawAnimal(spy,p,0,0,100);
   return {shape_id:p.shape_id,rot,empty_cells:empty,whole_image_draw_calls:wholeCalls,cropped_draw_calls:partialCalls,step};
  },{id,rot});rotations.push(metric);check('no slice or opaque empty-cell center '+sid+rot,metric.whole_image_draw_calls===1&&metric.cropped_draw_calls===0&&metric.empty_cells.every(c=>c.center_alpha<60));
  await page.screenshot({path:path.join(out,`actual-${sid}-rotation-${rot}.png`)});
  await pick(id);await move(20,60);await page.mouse.up();check('whole art retrieved '+sid+rot,await page.evaluate(id=>!pieces.find(p=>p.piece_id===id).at&&!held,id));
 }
 // Replay the genuine seventh level with all three animal species adjacent, using actual input.
 await page.evaluate(()=>begin(6));const level=JSON.parse(fs.readFileSync(path.join(root,'tasks/LEVEL_GENERATOR_001/chapter_preview_levels.json')))[6];
 for(const q of level.proof.solution){await pick(q.piece_id);for(let k=0;k<q.rot;k++)await right();await drop(q.at);}
 check('mapped animals adjacent with full legal cover',await page.evaluate(()=>complete()&&pieces.filter(p=>chapterAnimals[p.shape_id]&&p.at).length===level.pieces.filter(p=>chapterAnimals[p.shape_id]).length));
 const adjacency=await page.evaluate(()=>{
  const unit=60,W=level.w*unit,H=level.h*unit,masks=pieces.map(p=>{const c=document.createElement('canvas');c.width=W;c.height=H;const a=c.getContext('2d');if(chapterAnimals[p.shape_id])drawAnimal(a,p,p.at[0]*unit,p.at[1]*unit,unit);else{a.fillStyle='#000';for(const [x,y] of shape(p))a.fillRect((p.at[0]+x)*unit,(p.at[1]+y)*unit,unit,unit);}return {id:p.piece_id,shape:p.shape_id,data:a.getImageData(0,0,W,H).data};});
  const result=[];for(let i=0;i<masks.length;i++)for(let j=i+1;j<masks.length;j++){const a=masks[i],b=masks[j];if(!chapterAnimals[a.shape]&&!chapterAnimals[b.shape])continue;let n=0;for(let k=3;k<a.data.length;k+=4)if(a.data[k]>200&&b.data[k]>200)n++;if(n)result.push({a:a.shape+'#'+a.id,b:b.shape+'#'+b.id,overlap_pixels:n,cell_area:unit*unit,equivalent_cell_area:n/(unit*unit)});}return result;
 });overlaps.push(...adjacency);await page.screenshot({path:path.join(out,'actual-three-animals-adjacent.png')});
 // Retrieve every animal from the crowded solved board and restore the exact pose.
 for(const q of level.proof.solution.filter(q=>['4','5','6'].includes(q.piece_id))){await pick(q.piece_id);check('neighbor pickup hides next '+q.piece_id,await page.locator('#next').isHidden());await move(20,60);await page.mouse.up();check('neighbor retrieve '+q.piece_id,await page.evaluate(()=>!complete()));await pick(q.piece_id);await drop(q.at);check('neighbor replace restores cover '+q.piece_id,await page.evaluate(()=>complete()));}
 // Rotate the entire legal square board layout; retain original occupied_cells and test all neighbor directions.
 for(let globalRot=1;globalRot<4;globalRot++){
  await page.evaluate(()=>begin(6));
  const poses=await page.evaluate(({proof,turns})=>proof.map(q=>{const p=pieces.find(p=>p.piece_id===q.piece_id);let cells=G.shape(p,q.rot).map(([x,y])=>[x+q.at[0],y+q.at[1]]);for(let n=0;n<turns;n++)cells=cells.map(([x,y])=>[level.w-1-y,x]);return {piece_id:q.piece_id,rot:(q.rot+turns)%4,at:[Math.min(...cells.map(c=>c[0])),Math.min(...cells.map(c=>c[1]))]};}),{proof:level.proof.solution,turns:globalRot});
  for(const q of poses){await pick(q.piece_id);for(let k=0;k<q.rot;k++)await right();await drop(q.at);}
  check('neighbor board rotated '+globalRot,await page.evaluate(()=>complete()));
  await page.screenshot({path:path.join(out,'actual-neighbors-rotation-'+globalRot+'.png')});
 }
 // Regression for Edge's repeated loss after suppressed right menu: recovery must survive both losses.
 await page.evaluate(()=>begin(6));await pick('4');await right();
 for(let n=0;n<2;n++){await page.locator('canvas').dispatchEvent('lostpointercapture',{pointerId:1,buttons:1});check('repeated capture loss preserves held animal '+n,await page.evaluate(()=>!!held&&held.contextRotation));}
 await page.locator('canvas').dispatchEvent('pointercancel');await page.mouse.up();check('cancel still restores original animal',await page.evaluate(()=>!held&&pieces.every(p=>!p.at&&p.rot===0)));
 await pick('4');await right();await page.evaluate(()=>window.dispatchEvent(new Event('blur')));await page.mouse.up();check('blur still cancels rotated drag',await page.evaluate(()=>!held&&pieces.every(p=>!p.at&&p.rot===0)));
 await page.keyboard.press('r');check('R resets all real sprites',await page.evaluate(()=>pieces.every(p=>!p.at&&p.rot===0)&&!held));check('no page errors',errors.length===0);
 const report={status:'PASS_TESTED_INTERACTION_AND_ROTATION_WITH_LOCAL_CONTOUR_PROTRUSIONS',checks,rotations,adjacent_alpha_overlaps:overlaps,errors,limits:'Empty-cell centers and atomic interaction checked; local edge/feather protrusions remain recorded, not claimed pixel-exact silhouette. G3 is HUMAN approval, not replaced by this test.'};fs.writeFileSync(path.join(reportDir,'animal-browser-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({checks:checks.length,rotations:rotations.length,overlaps,errors}));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
