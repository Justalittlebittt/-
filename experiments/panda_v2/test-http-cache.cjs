require('../../tools/check-runtime.cjs')();
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const fs=require('fs'),http=require('http'),path=require('path'),assert=require('node:assert/strict'),{execFileSync}=require('child_process');
(async()=>{
 const root=path.resolve(__dirname,'../..'),out=path.join(root,'tasks/HTTP_CACHE_FIX_001');
 const legacy=execFileSync('git',['-c','safe.directory='+root,'show','7f4299c:experiments/panda_v2/assets.js'],{cwd:root});
 let oldRequests=0,newRequests=0;
 const server=http.createServer((req,res)=>{const url=new URL(req.url,'http://localhost');let p=decodeURIComponent(url.pathname);let data;
 if(p==='/experiments/panda_v2/legacy.html'){data=fs.readFileSync(path.join(root,'experiments/panda_v2/index.html'),'utf8').replace(/\?v=[a-f0-9]+/g,'');}
 else if(p==='/experiments/panda_v2/assets.js'&&!url.search){data=legacy;oldRequests++;res.setHeader('Cache-Control','max-age=31536000');}
 else{const full=path.resolve(root,'.'+p);if(!full.startsWith(root+path.sep)||!fs.existsSync(full)){res.writeHead(404);res.end();return;}data=fs.readFileSync(full);if(p.endsWith('/assets.js'))newRequests++;}
 res.setHeader('Content-Type',p.endsWith('.html')?'text/html; charset=utf-8':p.endsWith('.js')?'text/javascript':p.endsWith('.css')?'text/css':p.endsWith('.png')?'image/png':'application/octet-stream');res.end(data);
 });await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;const browser=await chromium.launch({channel:'msedge',headless:true});
 try{const page=await browser.newPage({viewport:{width:612,height:906}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/experiments/panda_v2/legacy.html');await page.waitForFunction(()=>typeof animalAssets==='undefined');assert.ok(errors.some(e=>e.includes('animalAssets')));await page.screenshot({path:path.join(out,'reproduced-blank.png')});const legacyErrors=[...errors];errors.length=0;
 await page.goto(base+'/experiments/panda_v2/index.html');await page.waitForFunction(()=>pieces.length===4&&Object.values(animalImages).every(i=>i.naturalWidth)&&environment.naturalWidth);assert.equal(errors.length,0);assert.equal(oldRequests,1);assert.equal(newRequests,1);await page.screenshot({path:path.join(out,'fixed-existing-cache.png')});
 const report={status:'PASS',reproduced_legacy_errors:legacyErrors,fixed_page_errors:errors,old_unversioned_asset_requests:oldRequests,new_versioned_asset_requests:newRequests,viewport:[612,906],four_original_sprites_loaded:true};fs.writeFileSync(path.join(out,'cache-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
 }finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
