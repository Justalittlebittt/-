'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
function check(entry=path.resolve(__dirname,'../experiments/panda_v2/index.html'),html=fs.readFileSync(entry,'utf8')){
 let count=0;
 for(const m of html.matchAll(/(?:src|href)="([^"]+)"/g)){
  const [file,query]=m[1].split('?'),version=new URLSearchParams(query).get('v');
  const content=fs.readFileSync(path.resolve(path.dirname(entry),file),'utf8').replace(/\r\n/g,'\n');
  const hash=crypto.createHash('sha256').update(content).digest('hex').slice(0,16);
  if(version!==hash)throw Error('FAIL_STALE_RESOURCE_VERSION: '+file+'; run python tools/version-runtime.py');
  count++;
 }
 const expected=Number(html.match(/name="runtime-dependencies" content="(\d+)"/)?.[1]||6);
 if(count!==expected)throw Error('FAIL_RUNTIME_DEPENDENCIES_MISSING');
 return count;
}
module.exports=check;
if(require.main===module)console.log('PASS_RUNTIME_VERSIONS '+check());
