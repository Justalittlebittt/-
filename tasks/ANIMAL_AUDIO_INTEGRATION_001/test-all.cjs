'use strict';
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const execFile=require('util').promisify(require('child_process').execFile);
(async()=>{
 const root=path.resolve(__dirname,'../..'),errors=[],checks=[];
 const server=http.createServer((req,res)=>{const name=decodeURIComponent(req.url.split('?')[0]);const file=path.resolve(root,'.'+name);if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',file.endsWith('.js')?'application/javascript':file.endsWith('.css')?'text/css':file.endsWith('.wav')?'audio/wav':file.endsWith('.html')?'text/html':'image/png');res.end(fs.readFileSync(file));});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url=`http://127.0.0.1:${server.address().port}/experiments/chapter_preview/index.html`;
 let browser;
 try{
  browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);await page.evaluate(()=>chapterArtReady);
  const keys=await page.evaluate(()=>Object.keys(animalClickSounds));assert.equal(keys.length,11);
  await page.evaluate(()=>{const b=document.createElement('button');b.id='audio-qa';b.style='position:fixed;top:0;left:0;z-index:99999';b.textContent='Audio QA';document.body.append(b);animalAudio.cooldownMs=0;});
  for(const key of keys){
   await page.evaluate(key=>{document.querySelector('#audio-qa').onclick=async()=>{window.audioResult=await animalAudio.play(key);};window.audioResult=null;},key);
   await page.locator('#audio-qa').click();await page.waitForFunction(()=>window.audioResult!==null);assert.equal(await page.evaluate(()=>audioResult),true);
   const duration=await page.evaluate(async key=>{const a=new Audio(animalClickSounds[key]);await new Promise((ok,fail)=>{a.onloadedmetadata=ok;a.onerror=fail;});return a.duration;},key);
   assert.ok(Math.abs(duration-1.5)<.001);checks.push(key+' trusted-click playback and 1.5s duration');
  }
  await page.evaluate(()=>animalAudio.stop());assert.equal(errors.length,0);await browser.close();browser=null;
  await execFile(process.execPath,[path.join(root,'tasks/ANIMAL_CLICK_AUDIO_001/test-browser.cjs')],{stdio:'inherit',env:{...process.env,AUDIO_TEST_URL:url,AUDIO_REPORT_FILE:path.join(__dirname,'source-browser-report.json')}});
  fs.writeFileSync(path.join(__dirname,'all-voices-report.json'),JSON.stringify({status:'PASS',checks,errors},null,2));
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
