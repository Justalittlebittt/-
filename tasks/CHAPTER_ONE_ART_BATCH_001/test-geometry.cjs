'use strict';
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict'),crypto=require('crypto'),vm=require('vm');
const G=require('../../tools/level_generator/geometry.js'),root=path.resolve(__dirname,'../..');
const task=path.resolve(process.env.ASSET_TASK_DIR||__dirname);
const handoff=JSON.parse(fs.readFileSync(path.join(task,process.env.ASSET_SPEC_FILE||'handoff_art_to_design.json'))),assets=JSON.parse(fs.readFileSync(path.join(task,'asset-report.json'))).assets;
const sandbox={};vm.runInNewContext(fs.readFileSync(path.join(root,'experiments/chapter_preview/levels.js'),'utf8')+';globalThis.levels=previewLevels;',sandbox);
const reg={};vm.runInNewContext(fs.readFileSync(path.join(root,'experiments/chapter_preview/animals.js'),'utf8').split('const chapterAnimalImages')[0]+';globalThis.assets=chapterAnimals;',reg);
let bounds=0,collisions=0,instances=0;
for(const a of handoff.assets){
 const cfg=reg.assets[a.shape_id];assert.ok(cfg);assert.equal(cfg.sha256,a.image_sha256);assert.equal(cfg.version,a.asset_version);assert.equal(path.basename(cfg.src.split('?')[0]),path.basename(assets.find(b=>b.shape_id===a.shape_id).repository_file));assert.equal(JSON.stringify(cfg.baseSize),JSON.stringify(G.dims(a.occupied_cells)));
 if(a.offsetCells)assert.equal(JSON.stringify(cfg.offsetCells),JSON.stringify(a.offsetCells));
 if(a.sourceBounds)assert.equal(JSON.stringify(cfg.sourceBounds),JSON.stringify(a.sourceBounds));if(a.baseRotation!==undefined)assert.equal(cfg.baseRotation||0,a.baseRotation);

 const meta=assets.find(b=>b.shape_id===a.shape_id),raw=fs.readFileSync(path.join(root,meta.repository_file));assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),a.image_sha256);assert.equal(raw.length,a.bytes);
 for(const l of sandbox.levels)for(const p of l.pieces)if(p.shape_id===a.shape_id){assert.equal(JSON.stringify(p.occupied_cells),JSON.stringify(a.occupied_cells));instances++;}
 const p={occupied_cells:a.occupied_cells},level={w:6,h:5,blocked:[]};
 for(let rot=0;rot<4;rot++){
  let manual=a.occupied_cells.map(c=>[...c]);for(let n=0;n<rot;n++)manual=manual.map(([x,y])=>[-y,x]);const mx=Math.min(...manual.map(c=>c[0])),my=Math.min(...manual.map(c=>c[1]));manual=manual.map(([x,y])=>[x-mx,y-my]);
  assert.deepEqual(new Set(G.shape(p,rot).map(c=>c.join(':'))),new Set(manual.map(c=>c.join(':'))));p.rot=rot;
  for(let y=-1;y<=5;y++)for(let x=-1;x<=6;x++){assert.equal(G.valid(level,[p],p,[x,y]),manual.every(([a,b])=>a+x>=0&&b+y>=0&&a+x<6&&b+y<5));bounds++;}
  for(const cell of manual){assert.equal(G.valid(level,[p,{occupied_cells:[[0,0]],at:cell}],p,[0,0]),false);collisions++;}
 }
}
const report={status:'PASS',exact_original_hashes:handoff.assets.length,unchanged_existing_occupied_cell_instances:instances,four_rotation_assets:handoff.assets.length,boundary_cases:bounds,occupied_collision_cases:collisions};fs.writeFileSync(path.join(task,'geometry-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
