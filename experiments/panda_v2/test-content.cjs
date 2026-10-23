const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');const {pathToFileURL}=require('url');const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage({viewport:{width:1280,height:720}}),checks=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
 const out=path.resolve(__dirname,'../../tasks/FIRST_LEVEL_CONTENT_001/evidence');const check=(name,value)=>{assert.ok(value,name);checks.push(name);};
 await page.goto(process.env.PUZZLE_TEST_URL||pathToFileURL(path.join(__dirname,'index.html')).href);await page.waitForFunction(()=>Object.values(animalImages).every(im=>im.naturalWidth)&&environment.naturalWidth);
 async function move(x,y){const r=await page.locator('canvas').boundingBox();await page.mouse.move(r.x+x*r.width/1672,r.y+y*r.height/941,{steps:4});}
 async function hover(id){const v=await page.evaluate(id=>{const o=position(pieces.find(p=>p.id===id));return {x:o.x+step*.4,y:o.y+step*.4};},id);await move(v.x,v.y);}
 async function pick(id){await hover(id);await page.mouse.down();}
 async function right(){await page.mouse.down({button:'right'});await page.mouse.up({button:'right'});}
 async function drop(x,y){const v=await page.evaluate(([x,y])=>({x:board.x+x*step+held.offset.x,y:board.y+y*step+held.offset.y}),[x,y]);await move(v.x,v.y);await page.mouse.up();}
 check('four independent instances share two original full images',await page.evaluate(()=>pieces.map(p=>p.id).join('')==='ABCD'&&pieces.map(p=>p.base.length).join(',')==='6,4,6,4'&&pieces[1]!==pieces[3]&&pieces[1].kind==='rabbit'&&pieces[3].kind==='rabbit'&&Object.keys(animalImages).length===2));
 const geometry=await page.evaluate(()=>{let cases=0;for(const p of pieces){PuzzleCore.normalize(p.base);const original=JSON.stringify(shape(p));for(let r=0;r<4;r++){p.rot=r;for(const [x,y] of shape(p)){const o=position(p);if(locate({x:o.x+(x+.4)*step,y:o.y+(y+.4)*step})!==p)throw Error('fragment hit');}for(let y=-1;y<=board.h;y++)for(let x=-1;x<=board.w;x++){const expected=shape(p).every(([a,b])=>a+x>=0&&b+y>=0&&a+x<board.w&&b+y<board.h);if(legal(p,[x,y])!==expected)throw Error('bounds');cases++;}}p.rot=0;if(JSON.stringify(shape(p))!==original)throw Error('four rotations');}return cases;});
 check('integer connected shapes atomic hits and exhaustive four-direction bounds',geometry===672);
 for(const [width,height] of [[1280,720],[1024,768],[800,600]]){
 await page.setViewportSize({width,height});await page.keyboard.press('r');
 const layout=await page.evaluate(()=>{const b={x:board.x,y:board.y,w:board.w*step,h:board.h*step};const rects=pieces.map(p=>{const o=position(p),[w,h]=dims(shape(p));return {...o,w:w*step,h:h*step};});const overlaps=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;return rects.every((a,i)=>a.x>=0&&a.y>=0&&a.x+a.w<=C.width&&a.y+a.h<=C.height&&!overlaps(a,b)&&rects.slice(i+1).every(q=>!overlaps(a,q)));});check('balanced unclipped start '+width,layout);await page.screenshot({path:path.join(out,`start-${width}.png`)});
 for(const id of ['A','B','C','D']){
 await hover(id);await right();check('standalone right rotates '+width+' '+id,await page.evaluate(id=>pieces.find(p=>p.id===id).rot===1,id));
 await pick(id);const before=await page.evaluate(()=>({...held.offset}));for(let k=0;k<4;k++)await right();check('held four rotations retain offset '+width+' '+id,await page.evaluate(o=>Math.abs(o.x-held.offset.x)<.01&&Math.abs(o.y-held.offset.y)<.01,before));
 await page.locator('canvas').dispatchEvent('pointercancel');await page.mouse.up();
 }
 await page.keyboard.press('r');
 for(const [id,x,y] of [['A',0,0],['B',3,0],['C',0,2],['D',3,2]]){await pick(id);await drop(x,y);check('real pointer placement '+width+' '+id,await page.evaluate(({id,x,y})=>{const p=pieces.find(p=>p.id===id);return p.at?.[0]===x&&p.at?.[1]===y;},{id,x,y}));if(id!=='D')check('partial cannot complete '+width+' '+id,await page.locator('#next').isHidden());}
 check('full 20-cell board unlocks next '+width,await page.evaluate(()=>complete())&&await page.locator('#next').isVisible());await page.screenshot({path:path.join(out,`complete-${width}.png`)});
 await pick('B');check('pickup hides next immediately '+width,await page.locator('#next').isHidden());await drop(0,0);check('collision rollback restores B not A '+width,await page.evaluate(()=>complete()&&pieces[1].at[0]===3&&pieces[0].at[0]===0));
 await hover('C');await right();check('illegal placed rotation atomic rollback '+width,await page.evaluate(()=>pieces[2].rot===0&&complete()));
 await pick('D');await move(1400,715);await page.mouse.up();check('retrieval preserves other rabbit '+width,await page.evaluate(()=>!pieces[3].at&&pieces[1].at[0]===3&&!complete()));
 await pick('D');await right();await page.locator('canvas').dispatchEvent('pointercancel');await page.mouse.up();check('cancel restores rabbit angle '+width,await page.evaluate(()=>pieces[3].rot===0&&!held));
 await page.keyboard.press('r');check('R resets all four '+width,await page.evaluate(()=>pieces.length===4&&pieces.every(p=>!p.at&&p.rot===0)));
 }
 await page.setViewportSize({width:1280,height:720});await page.keyboard.press('r');
 const covers=await page.evaluate(()=>{let count=0;function dfs(i){if(i===pieces.length){if(complete())count++;return;}const p=pieces[i],seen=new Set();for(let r=0;r<4;r++){p.rot=r;const key=JSON.stringify(shape(p));if(seen.has(key))continue;seen.add(key);for(let y=0;y<board.h;y++)for(let x=0;x<board.w;x++)if(legal(p,[x,y])){p.at=[x,y];dfs(i+1);p.at=null;}}p.rot=0;}dfs(0);reset();return count;});
 check('independent runtime enumeration finds 16 exact covers',covers===16);
 for(const [id,x,y,r] of [['A',0,0,2],['B',3,0,1],['C',0,2,2],['D',3,2,3]]){await pick(id);for(let i=0;i<r;i++)await right();await drop(x,y);}
 check('actual rotated full-sprite solution completes',await page.evaluate(()=>complete()&&pieces[0].rot===2&&pieces[1].rot===1&&pieces[3].rot===3));await page.screenshot({path:path.join(out,'rotated-neighbors.png')});
 check('next remains exactly right of board',await page.evaluate(()=>{const r=next.getBoundingClientRect(),c=C.getBoundingClientRect();return r.left>c.left+(board.x+board.w*step)*c.width/C.width;}));
 await page.evaluate(()=>{window.nextRequests=0;C.addEventListener('nextlevelrequest',()=>window.nextRequests++);});await page.locator('#next').click();check('next hook fires only after true completion',await page.evaluate(()=>nextRequests===1));
 await pick('A');await page.setViewportSize({width:1024,height:768});await page.waitForFunction(()=>!held);await page.mouse.up();check('resize cancels held animal atomically',await page.evaluate(()=>!held&&pieces[0].at[0]===0&&pieces[0].rot===2));await page.keyboard.press('r');await page.setViewportSize({width:1280,height:720});
 for(let rot=0;rot<4;rot++){await page.evaluate(rot=>{for(const p of pieces)p.rot=rot;draw();},rot);await page.screenshot({path:path.join(out,`four-animals-rotation-${rot*90}.png`)});}
 await page.evaluate(()=>{const img=animalImages.rabbit;C.width=1000;C.height=540;ctx.fillStyle='#fff9e8';ctx.fillRect(0,0,500,540);ctx.fillStyle='#263e32';ctx.fillRect(500,0,500,540);ctx.drawImage(img,50,50,400,400);ctx.drawImage(img,550,50,400,400);});await page.locator('canvas').screenshot({path:path.join(out,'rabbit-alpha-light-dark.png')});
 check('no JS errors',errors.length===0);const report={status:'REAL_APPROVED_ART_G4_PASS',checks,geometry_cases:geometry,errors,browser:await browser.version(),scope:'first level, four actual complete sprites; no synthetic completion fixture',gates:{G1:'SEE_ASSET_REPORT_AND_COMPOSITE_REVIEW',G2:'PASS_TESTED_SHAPE_ROTATION_ALIGNMENT',G3:'HUMAN_APPROVED_EXACT_VERSION',G4:'PASS_FIRST_LEVEL_DESKTOP_MOUSE_KEYBOARD_SCOPE'}};fs.writeFileSync(path.join(out,'runtime-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({passed:checks.length,geometry_cases:geometry,errors}));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});



