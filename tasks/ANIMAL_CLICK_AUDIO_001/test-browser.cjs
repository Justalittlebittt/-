'use strict';
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict'),{chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage({viewport:{width:1280,height:720}}),checks=[],errors=[];let game=page;page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.AUDIO_TEST_URL||'http://127.0.0.1:8765/experiments/chapter_preview/index.html');
 if(process.env.AUDIO_FRAME_SELECTOR)game=await(await page.locator(process.env.AUDIO_FRAME_SELECTOR).elementHandle()).contentFrame();
 await game.evaluate(()=>chapterArtReady);await game.locator('#begin').click();
 await game.evaluate(()=>{window.audioCalls=[];window.audioStarted=0;window.audioRejected=0;const play=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){audioCalls.push(this.src);window.lastAudio=this;const result=play.call(this);result.then(()=>audioStarted++,()=>audioRejected++);return result;};});
 const check=(n,v)=>{assert.ok(v,n);checks.push(n);};
 const move=async(x,y)=>{const r=await game.locator('canvas').boundingBox();await page.mouse.move(r.x+x*r.width/1672,r.y+y*r.height/941,{steps:5});};
 const pick=async()=>{const p=await game.evaluate(()=>{const p=pieces[0],o=pos(p),c=shape(p)[0];return {x:o.x+(c[0]+.45)*step,y:o.y+(c[1]+.45)*step};});await move(p.x,p.y);await page.mouse.down();};
 const reset=async()=>{await page.mouse.up();await page.keyboard.press('r');};
 const configured=await game.evaluate(()=>animalClickSounds.I3);
 if(process.env.AUDIO_EXPECT_PACKAGED){check('packaged audio URL present',!!configured&&configured.startsWith('audio/'));}
 else if(!configured){await pick();check('unset mapping stays quiet and allows pickup',await game.evaluate(()=>audioCalls.length===0&&!!held));await reset();}
 const clip=configured||'../../tasks/ANIMAL_CLICK_AUDIO_001/fixtures/qa-click-tone.wav';
 await game.evaluate(clip=>{animalClickSounds.I3=clip;animalAudio.cooldownMs=0;animalAudio.volume=.25;},clip);
 await pick();await game.waitForFunction(()=>audioStarted===1);
 check('native audio decoded and started on left press',await game.evaluate(()=>!!held&&lastAudio.readyState>=2&&lastAudio.volume===.25));
 await move(835,470);await page.mouse.down({button:'right'});await page.mouse.up({button:'right'});
 check('drag and right rotation do not replay',await game.evaluate(()=>audioCalls.length===1&&!!held));await reset();
 await move(838,476);await page.mouse.down();await page.mouse.up();check('empty board does not play',await game.evaluate(()=>audioCalls.length===1));
 await game.evaluate(()=>animalAudio.setMuted(true));await pick();check('mute does not block pickup',await game.evaluate(()=>audioCalls.length===1&&!!held));await reset();
 await game.evaluate(()=>{animalAudio.setMuted(false);animalAudio.cooldownMs=60000;});await pick();check('rapid click guard keeps input working',await game.evaluate(()=>audioCalls.length===1&&!!held));await reset();
 await page.route('**/missing-click-audio.wav',r=>r.fulfill({status:404,body:'QA missing audio'}));
 await game.evaluate(()=>{animalAudio.cooldownMs=0;animalClickSounds.I3='missing-click-audio.wav';});await pick();await game.waitForFunction(()=>audioRejected>=1);
 check('missing media leaves animal draggable',await game.evaluate(()=>!!held&&phase==='PLAY'));await reset();
 check('missing media returns false',await game.evaluate(()=>animalAudio.play('I3'))===false);
 await game.evaluate(clip=>{animalClickSounds.I3=clip;},clip);await pick();await game.waitForFunction(()=>audioStarted===2);
 check('valid media works again after error',await game.evaluate(()=>!!held&&lastAudio.readyState>=2));await reset();
 check('no unhandled script errors',errors.length===0);
 const report={status:'PASS_REAL_MEDIA_CLICK_AUDIO',checks,errors,native_play_starts:await game.evaluate(()=>audioStarted),test_clip_only:!configured,packaged_audio:!!process.env.AUDIO_EXPECT_PACKAGED,notes:'Verified native media decode/play promises in Edge; human listening approval is recorded separately.'};
 const output=path.resolve(process.env.AUDIO_REPORT_FILE||path.join(__dirname,'source-browser-report.json'));fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2));console.log(JSON.stringify({checks:checks.length,errors}));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
