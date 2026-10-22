const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const realAsset=process.argv.includes('--real-asset');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
const page=await browser.newPage({viewport:{width:1100,height:1000}}),errors=[],checks=[];
page.on('pageerror',e=>errors.push(e.message));
await page.goto(pathToFileURL(path.resolve(__dirname,'index.html')).href);
if(realAsset)await page.waitForFunction(()=>img.complete&&img.naturalWidth===1536);
else {await page.route('**/panda_rect6_desktop_001.png',route=>route.abort());await page.reload();await page.waitForFunction(()=>document.getElementById('asset-status').textContent.includes('ASSET_LOCAL_MISSING'));}
const check=(name,value)=>{assert.ok(value,name);checks.push(name);};
async function state(){return page.evaluate(()=>({index,pieces:pieces.map(p=>({id:p.id,at:p.at,rot:p.rot})),held:!!held,done:complete()}));}
async function point(x,y){const r=await page.locator('canvas').boundingBox();const size=await page.evaluate(()=>({w:C.width,h:C.height}));return {x:r.x+x*r.width/size.w,y:r.y+y*r.height/size.h};}
async function move(x,y){const p=await point(x,y);await page.mouse.move(p.x,p.y,{steps:5});}
async function pick(id){const p=await page.evaluate(id=>{const p=pieces.find(p=>p.id===id);return {x:(p.at?board.x+p.at[0]*step:p.tray.x)+30,y:(p.at?board.y+p.at[1]*step:p.tray.y)+30};},id);await move(p.x,p.y);await page.mouse.down();}
async function drop(x,y){const p=await page.evaluate(([x,y])=>({x:board.x+x*step+held.offset.x,y:board.y+y*step+held.offset.y}),[x,y]);await move(p.x,p.y);await page.mouse.up();}
check(realAsset?'approved PNG loaded with expected dimensions':'asset explicitly missing',await page.evaluate(real=>real?img.naturalWidth===1536&&img.naturalHeight===1024:img.naturalWidth===0,realAsset));
const batch=await page.evaluate(()=>{
let placements=0;const solutions=[];
for(let i=0;i<levels.length;i++){
 start(i);const l=levels[i];
 for(const p of pieces){PuzzleCore.normalize(p.base);let original=JSON.stringify(shape(p));for(let k=0;k<4;k++){p.rot=(p.rot+1)%4;}if(JSON.stringify(shape(p))!==original)throw Error('rotation');
 for(let r=0;r<4;r++){p.rot=r;for(let y=-1;y<=l.h;y++)for(let x=-1;x<=l.w;x++){const expected=shape(p).every(([a,b])=>x+a>=0&&y+b>=0&&x+a<l.w&&y+b<l.h);if(legal(p,[x,y])!==expected)throw Error('bounds');placements++;}}p.rot=0;}
 function solve(j){if(j===pieces.length)return complete();const p=pieces[j];for(let r=0;r<4;r++){p.rot=r;for(let y=0;y<l.h;y++)for(let x=0;x<l.w;x++)if(legal(p,[x,y])){p.at=[x,y];if(solve(j+1))return true;p.at=null;}}return false;}
 if(!solve(0))throw Error('unsolvable');solutions.push(pieces.map(p=>({id:p.id,at:p.at,rot:p.rot})));
}start(0);return {placements,solutions};});
check('all shapes connected, four rotations, exhaustive boundary matrix and all three levels solvable',batch.placements>0);
await pick('P');await move(410,320);
check('grab offset follows pointer',await page.evaluate(()=>Math.abs(mouse.x-held.offset.x-380)<.1&&Math.abs(mouse.y-held.offset.y-290)<.1));
await drop(0,0);check('level one completion', (await state()).done);
await pick('P');await page.keyboard.press('r');check('placed piece freely rotates while held',(await state()).pieces[0].rot===1);
await move(390,100);await page.mouse.up();check('invalid rotated drop restores original position AND rotation',JSON.stringify((await state()).pieces[0])===JSON.stringify({id:'P',at:[0,0],rot:0}));
await pick('P');await page.keyboard.press('r');await page.locator('canvas').dispatchEvent('pointercancel');await page.mouse.up();check('cancel restores original state',(await state()).done&&(await state()).pieces[0].rot===0);
await pick('P');await move(30,360);await page.mouse.up();check('retrieve disables next',!(await state()).pieces[0].at&&await page.locator('#next').isDisabled());
await page.locator('#reset').click();check('reset clears state',(await state()).pieces.every(p=>p.at===null&&p.rot===0));
for(let i=0;i<3;i++){
 for(const target of batch.solutions[i]){await pick(target.id);for(let r=0;r<target.rot;r++)await page.keyboard.press('r');await drop(...target.at);}
 check('pointer-driven level '+(i+1)+' solved',(await state()).done);
 if(i===1){await pick('B');await drop(0,0);check('collision rollback preserves completed board',(await state()).done);}
 await page.locator('#next').click();
}
check('chapter ending visible',await page.locator('#done').isVisible());
const out=path.resolve(__dirname,realAsset?'../../tasks/LOCAL_APPROVED_ASSETS_001':'../../tasks/CODEX_TAKEOVER_001');fs.mkdirSync(out,{recursive:true});
await page.screenshot({path:path.join(out,'chapter-complete.png'),fullPage:true});
await page.locator('#restart').click();check('restart returns to fresh level one',(await state()).index===0&&!(await state()).done);
await page.setViewportSize({width:420,height:950});
await pick('P');await drop(0,0);check('scaled viewport pointer coordinates',(await state()).done);
await page.evaluate(()=>{start(2);for(const p of pieces)p.rot=1;layoutTray();draw();});
check('rotated tray pieces fit canvas without overlap',await page.evaluate(()=>pieces.every((p,i)=>{const [w,h]=dims(shape(p));return p.tray.x>=0&&p.tray.x+w*step<=C.width&&p.tray.y+h*step<=C.height&&pieces.slice(i+1).every(q=>{const [qw,qh]=dims(shape(q));return p.tray.x+w*step<=q.tray.x||q.tray.x+qw*step<=p.tray.x||p.tray.y+h*step<=q.tray.y||q.tray.y+qh*step<=p.tray.y;});})));
await page.screenshot({path:path.join(out,realAsset?'scaled-approved.png':'scaled-placeholder.png'),fullPage:true});check('no runtime exceptions',errors.length===0);
if(realAsset){
 await page.setViewportSize({width:1100,height:1100});
 await page.evaluate(()=>{start(0);C.width=800;C.height=740;ctx.clearRect(0,0,800,740);selection=null;const p=pieces[0];for(let r=0;r<4;r++){p.rot=r;const x=40+(r%2)*390,y=35+Math.floor(r/2)*350;const [w,h]=dims(shape(p));for(let b=0;b<h;b++)for(let a=0;a<w;a++)rounded(x+a*step,y+b*step,cell,cell,'#fff9ea');drawPiece(p,x,y);ctx.fillStyle='#263945';ctx.font='18px system-ui';ctx.fillText(String(r*90)+'°',x,y-8);}});
 await page.locator('canvas').screenshot({path:path.join(out,'four-rotations.png')});
}
const report={status:realAsset?'PASS_APPROVED_PNG_INTERACTION':'PASS_PLACEHOLDER_ONLY',browser:await browser.version(),checks,batch,errors,formal_art:realAsset?{status:'DESKTOP_APPROVED_001_LOADED',G1:'SEE_ASSET_REPORT',G2_visual:'FOUR_ROTATION_SCREENSHOT_REVIEW',G3:'HUMAN_APPROVED',G4:'PASS_TESTED_INTERACTION_SCOPE_ONLY'}:{status:'ASSET_LOCAL_MISSING',G1:'NOT_RUN',G2_visual:'NOT_RUN',G3:'NOT_REAPPROVED',G4:'NOT_RUN'}};
fs.writeFileSync(path.join(out,'browser-report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
