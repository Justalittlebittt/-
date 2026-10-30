'use strict';
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{
const repo=path.resolve(__dirname,'../..'),root=path.resolve(process.env.MUSIC_ROOT||repo),out=path.resolve(process.env.MUSIC_REPORT_DIR||__dirname);fs.mkdirSync(out,{recursive:true});
const packaged=!!process.env.MUSIC_ROOT,checks=[],errors=[];
const gameServer=http.createServer((req,res)=>{const p=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));if(!p.startsWith(root+path.sep)||!fs.existsSync(p)||!fs.statSync(p).isFile()){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',p.endsWith('.js')?'application/javascript':p.endsWith('.css')?'text/css':p.endsWith('.wav')?'audio/wav':p.endsWith('.html')?'text/html':'image/png');res.end(fs.readFileSync(p));});
await new Promise(r=>gameServer.listen(0,'127.0.0.1',r));const entry=`http://127.0.0.1:${gameServer.address().port}/`+(packaged?'index.html':'experiments/chapter_preview/index.html');
const wrapper=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html');res.end(`<iframe id="game" src="${entry}" sandbox="allow-scripts allow-same-origin" style="width:100vw;height:100vh;border:0"></iframe>`);});await new Promise(r=>wrapper.listen(0,'127.0.0.1',r));let browser;
try{
 browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage({viewport:{width:1280,height:720}});page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.musicPlays=0;window.voicePlays=0;const play=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){if(/chapter[_-]one[_-]music/.test(this.src)){window.musicPlayer=this;musicPlays++;}else voicePlays++;return play.call(this);};});
 const check=(n,v)=>{assert.ok(v,n);checks.push(n);};
 const open=async()=>{await page.goto(`http://127.0.0.1:${wrapper.address().port}/`);const f=await(await page.locator('#game').elementHandle()).contentFrame();await f.evaluate(()=>chapterArtReady);return f;};
 let game=await open();check('no music autoplay before gesture',await game.evaluate(()=>musicPlays===0&&!window.musicPlayer));
 await game.locator('#music-mute').click();await game.locator('#begin').click();check('muting before start respected',await game.evaluate(()=>musicPlays===0));
 await game.locator('#music-mute').click();await game.waitForFunction(()=>window.musicPlayer&&!musicPlayer.paused&&musicPlayer.readyState>=2);
 check('native music starts after user gesture',await game.evaluate(()=>musicPlays===1&&musicPlayer.loop&&musicPlayer.volume===.18&&musicPlayer.volume<animalAudio.volume));
 check('approved complete track duration',Math.abs(await game.evaluate(()=>musicPlayer.duration)-88)<.01);
 await game.waitForFunction(()=>musicPlayer.currentTime>.05);const time=await game.evaluate(()=>musicPlayer.currentTime);
 await game.evaluate(()=>begin(1));check('next level reuses playing music',await game.evaluate(time=>musicPlays===1&&!musicPlayer.paused&&musicPlayer.currentTime>=time,time));
 await page.keyboard.press('r');check('R reset does not restart music',await game.evaluate(()=>musicPlays===1&&!musicPlayer.paused));
 await game.locator('#music-mute').click();check('music mute keeps animal volume unchanged',await game.evaluate(()=>musicPlayer.muted&&animalAudio.volume===.6&&!animalAudio.muted));
 await game.locator('#music-mute').click();check('unmute does not create another player',await game.evaluate(()=>musicPlays===1&&!musicPlayer.muted));
 await game.locator('#music-volume').focus();await page.keyboard.press('Home');check('volume slider reaches zero',await game.evaluate(()=>musicPlayer.volume===0));
 for(let i=0;i<7;i++)await page.keyboard.press('ArrowRight');check('volume slider controls media volume',await game.evaluate(()=>Math.abs(musicPlayer.volume-.07)<.001));
 for(let loop=0;loop<2;loop++){await game.waitForFunction(()=>musicPlayer.readyState>=3);await game.evaluate(()=>{musicPlayer.currentTime=musicPlayer.duration-.2;});await game.waitForFunction(()=>musicPlayer.currentTime<1&&!musicPlayer.paused);check('native end-to-start loop '+loop,await game.evaluate(()=>musicPlays===1&&musicPlayer.loop));}
 const q=await game.evaluate(()=>{const p=pieces[0],v=pos(p),c=shape(p)[0];return {x:v.x+(c[0]+.5)*step,y:v.y+(c[1]+.5)*step};});const box=await game.locator('canvas').boundingBox();await page.mouse.click(box.x+q.x*box.width/1672,box.y+q.y*box.height/941);
 check('animal voice and music coexist',await game.evaluate(()=>voicePlays>0&&!musicPlayer.paused));
 await page.screenshot({path:path.join(out,'music-controls.png')});
 await game.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pagehide')));check('pagehide stops music',await game.evaluate(()=>musicPlayer.paused));
 game=await open();check('reopened page waits for begin again',await game.evaluate(()=>musicPlays===0&&!window.musicPlayer));await game.locator('#begin').click();await game.waitForFunction(()=>window.musicPlayer&&!musicPlayer.paused);check('reopened game plays a single track',await game.evaluate(()=>musicPlays===1));
 await page.setViewportSize({width:800,height:600});check('controls remain visible at small viewport',await game.locator('#music-mute').isVisible()&&await game.locator('#music-volume').isVisible());await page.screenshot({path:path.join(out,'music-controls-small.png')});
 check('no unhandled script errors',errors.length===0);fs.writeFileSync(path.join(out,'music-browser-report.json'),JSON.stringify({status:'PASS_NATIVE_MUSIC_IFRAME',checks,errors,packaged,loop_test:'Two native end boundaries exercised by seeking near end; not two full wall-clock track durations; seamless listening remains HUMAN review.'},null,2));console.log(JSON.stringify({music_checks:checks.length,packaged,errors}));
}finally{if(browser)await browser.close();await Promise.all([new Promise(r=>wrapper.close(r)),new Promise(r=>gameServer.close(r))]);}
})().catch(e=>{console.error(e);process.exitCode=1;});
