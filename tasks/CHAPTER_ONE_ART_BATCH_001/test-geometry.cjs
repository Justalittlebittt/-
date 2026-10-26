'use strict';
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict'),crypto=require('crypto'),vm=require('vm');
const G=require('../../tools/level_generator/geometry.js'),root=path.resolve(__dirname,'../..');
const handoff=JSON.parse(fs.readFileSync(path.join(__dirname,'handoff_art_to_design.json'))),assets=JSON.parse(fs.readFileSync(path.join(__dirname,'asset-report.json'))).assets;
const sandbox={};vm.runInNewContext(fs.readFileSync(path.join(root,'experiments/chapter_preview/levels.js'),'utf8')+';globalThis.levels=previewLevels;',sandbox);
let bounds=0,collisions=0,instances=0;
for(const a of handoff.assets){
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
const report={status:'PASS',exact_original_hashes:3,unchanged_existing_occupied_cell_instances:instances,four_rotation_assets:3,boundary_cases:bounds,occupied_collision_cases:collisions};fs.writeFileSync(path.join(__dirname,'geometry-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
