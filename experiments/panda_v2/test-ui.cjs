const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const {pathToFileURL}=require('url');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[],checks=[];page.on('pageerror',e=>errors.push(e.message));
const out=path.resolve(__dirname,'../../tasks/UI_FLOW_AND_LAYOUT_001/codex_evidence');
await page.goto(pathToFileURL(path.join(__dirname,'index.html')).href);await page.waitForFunction(()=>img.naturalWidth&&environment.naturalWidth);
const check=(n,v)=>{assert.ok(v,n);checks.push(n);};
await page.screenshot({path:path.join(out,'start.png')});check('START visible',await page.locator('#intro').isVisible());await page.locator('#begin').click();
check('one complete panda is one atomic piece across all six hit cells',await page.evaluate(()=>{const p=pieces[0];return pieces.filter(q=>q.kind==='panda').length===1&&p.base.length===6&&shape(p).every(([x,y])=>locate({x:p.tray.x+(x+.4)*step,y:p.tray.y+(y+.4)*step})===p);}));
async function move(x,y){const r=await page.locator('canvas').boundingBox();await page.mouse.move(r.x+x,r.y+y,{steps:4});}
async function pick(id){const v=await page.evaluate(id=>{const p=pieces.find(p=>p.id===id);return {x:(p.at?board.x+p.at[0]*step:p.tray.x)+step*.4,y:(p.at?board.y+p.at[1]*step:p.tray.y)+step*.4};},id);await move(v.x,v.y);await page.mouse.down();}
async function drop(x,y){const v=await page.evaluate(([x,y])=>({x:board.x+x*step+held.offset.x,y:board.y+y*step+held.offset.y}),[x,y]);await move(v.x,v.y);await page.mouse.up();}
const sizes=[[1280,720],[1024,768],[800,600]];const layouts=[];
for(const [width,height] of sizes){await page.setViewportSize({width,height});await page.waitForTimeout(80);
 for(let i=0;i<4;i++){
 const r=await page.evaluate(i=>{if(i===3){levels.push({w:6,h:5,blocks:Array.from({length:6},(_,j)=>({id:'S'+j,kind:'block',cells:[[0,0],[1,0],[0,1],[1,1],[0,2]]}))});}start(i);const l=levels[i];let ok=true;const rectangles=pieces.map(p=>{const [w,h]=dims(shape(p));return {x:p.tray.x,y:p.tray.y,w:w*step,h:h*step};});const b={x:board.x-12,y:board.y-12,w:l.w*step+24,h:l.h*step+24};const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;for(let j=0;j<rectangles.length;j++){const a=rectangles[j];if(a.x<0||a.y<0||a.x+a.w>C.width||a.y+a.h>C.height||overlap(a,b)||rectangles.slice(j+1).some(q=>overlap(a,q)))ok=false;}
 for(const p of pieces)p.rot=1;layoutTray();const rotated=pieces.every(p=>{const [w,h]=dims(shape(p));return p.tray.x>=0&&p.tray.x+w*step<=C.width&&p.tray.y>=0&&p.tray.y+h*step<=C.height;});
 draw();return {ok,rotated,step,index:i,canvas:[C.width,C.height],board:[l.w,l.h],pieces:pieces.length};},i);
 check(`layout ${width}x${height} board ${r.board}`,r.ok&&r.rotated&&r.step>=24);layouts.push({width,height,...r});
 await page.screenshot({path:path.join(out,`layout-${width}-${i}.png`)});if(i===3)await page.evaluate(()=>{levels.pop();start(0);});
 }
 check('controls within viewport '+width,await page.locator('#next').evaluate(e=>e.getBoundingClientRect().bottom<=innerHeight));
}
await page.setViewportSize({width:800,height:600});await page.waitForTimeout(80);
await page.evaluate(()=>{levels.push({w:6,h:5,blocks:Array.from({length:6},(_,j)=>({id:'S'+j,kind:'block',cells:Array.from({length:5},(_,y)=>[0,y])}))});start(3);});
check('long-piece overflow uses scroll instead of tiny targets',await page.evaluate(()=>step>=28&&sideMax[0]>0&&sideMax[1]>0));
await move(60,100);await page.mouse.wheel(0,1000);await page.waitForTimeout(80);
check('left wheel reaches last piece',await page.evaluate(()=>sideScroll[0]===sideMax[0]&&pieces[4].tray.y>=36&&pieces[4].tray.y+5*step<=C.height));
await pick('S4');check('scrolled last piece selectable',await page.evaluate(()=>held?.p.id==='S4'));await page.locator('canvas').dispatchEvent('pointercancel');await page.mouse.up();
await page.screenshot({path:path.join(out,'long-piece-scroll.png')});await page.evaluate(()=>{levels.pop();start(0);});
await page.setViewportSize({width:1280,height:720});await page.evaluate(()=>start(0));await page.waitForTimeout(80);
await pick('P');const offsets=await page.evaluate(()=>held.offset);await page.keyboard.press('r');await page.keyboard.press('r');await page.keyboard.press('r');await page.keyboard.press('r');check('four rotations preserve grab offset',await page.evaluate(o=>Math.abs(o.x-held.offset.x)<.01&&Math.abs(o.y-held.offset.y)<.01,offsets));
await page.locator('canvas').dispatchEvent('pointercancel');await page.mouse.up();check('cancel restores pose',await page.evaluate(()=>!held&&!pieces[0].at&&pieces[0].rot===0));
await pick('P');await drop(0,0);check('level complete',await page.evaluate(()=>complete()&&screen==='LEVEL_COMPLETE'));
await pick('P');await page.keyboard.press('r');const invalid=await page.evaluate(()=>({x:board.x+held.offset.x,y:board.y+held.offset.y}));await move(invalid.x,invalid.y);await page.mouse.up();check('invalid rotation drop rollback',await page.evaluate(()=>pieces[0].rot===0&&complete()));
await pick('P');await move(15,60);await page.mouse.up();check('retrieve restores staging and disables next',await page.evaluate(()=>!pieces[0].at&&document.getElementById('next').disabled));
await pick('P');await page.setViewportSize({width:800,height:600});await page.waitForTimeout(80);await page.mouse.up();check('resize while held cancels safely',await page.evaluate(()=>!held&&!pieces[0].at));
for(let i=0;i<3;i++){
 const solution=await page.evaluate(()=>{function dfs(j){if(j===pieces.length)return complete();const p=pieces[j];for(let r=0;r<4;r++){p.rot=r;for(let y=0;y<levels[index].h;y++)for(let x=0;x<levels[index].w;x++)if(legal(p,[x,y])){p.at=[x,y];if(dfs(j+1))return true;p.at=null;}}return false;}if(!dfs(0))throw Error('NO_SOLUTION');const result=pieces.map(p=>({id:p.id,at:p.at,rot:p.rot}));start(index);return result;});
 for(const p of solution){await pick(p.id);for(let r=0;r<p.rot;r++)await page.keyboard.press('r');await drop(...p.at);}
 check('pointer completed level '+i,await page.evaluate(()=>complete()));await page.locator('#next').click();
}
check('chapter complete',await page.evaluate(()=>screen==='CHAPTER_COMPLETE'));await page.screenshot({path:path.join(out,'chapter-complete.png')});await page.locator('#restart').click();check('replay START',await page.locator('#intro').isVisible());await page.locator('#begin').click();check('replay fresh',await page.evaluate(()=>index===0&&!complete()));
await page.locator('#reset').click();check('reset works',await page.evaluate(()=>pieces.every(p=>p.at===null&&p.rot===0)));check('no runtime errors',!errors.length);
fs.writeFileSync(path.join(out,'runtime-report.json'),JSON.stringify({status:'PASS_STAGE_A',browser:await browser.version(),checks,layouts,errors,background:'TEMPORARY_SCENERY_SAMPLES_ONLY_NOT_FINAL_G3'},null,2));console.log(JSON.stringify({checks:checks.length,layouts:layouts.length,errors}));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});

