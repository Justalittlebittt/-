(function(root,factory){const api=factory(root.PuzzleCore||(typeof require==='function'?require('../../experiments/first_playable_001/core.js'):null));if(typeof module==='object'&&module.exports)module.exports=api;root.PuzzleGeometry=api;})(typeof globalThis!=='undefined'?globalThis:this,function(P){
'use strict';
const key=c=>c.join(':');
const shape=(p,rot=p.rot||0)=>P.rotate(p.occupied_cells,rot*90);
const dims=c=>[Math.max(...c.map(p=>p[0]))+1,Math.max(...c.map(p=>p[1]))+1];
function valid(level,pieces,p,at,rot=p.rot||0){
 if(!at||at.length!==2||!at.every(Number.isInteger))return false;
 const used=new Set(level.blocked.map(key));
 for(const q of pieces)if(q!==p&&q.at)for(const [x,y] of shape(q))used.add(key([x+q.at[0],y+q.at[1]]));
 return shape(p,rot).every(([x,y])=>x+at[0]>=0&&y+at[1]>=0&&x+at[0]<level.w&&y+at[1]<level.h&&!used.has(key([x+at[0],y+at[1]])));
}
function complete(level,pieces){if(!pieces.length||pieces.some(p=>!p.at||!valid(level,pieces,p,p.at)))return false;const covered=new Set(level.blocked.map(key));for(const p of pieces)for(const [x,y] of shape(p))covered.add(key([x+p.at[0],y+p.at[1]]));return covered.size===level.w*level.h;}
function orientations(cells){const seen=new Set(),out=[];for(let rot=0;rot<4;rot++){const c=P.rotate(cells,rot*90),k=JSON.stringify(c);if(!seen.has(k)){seen.add(k);out.push({rot,cells:c});}}return out;}
function validate(level){
 if(!Number.isInteger(level.w)||!Number.isInteger(level.h)||level.w<1||level.h<1)throw Error('INVALID_BOARD');
 const keys=new Set();for(const c of level.blocked){if(!Array.isArray(c)||c.length!==2||!c.every(Number.isInteger)||c[0]<0||c[1]<0||c[0]>=level.w||c[1]>=level.h||keys.has(key(c)))throw Error('INVALID_BLOCKER');keys.add(key(c));}
 const ids=new Set();let area=keys.size;if(!level.pieces.length)throw Error('EMPTY_PIECES');for(const p of level.pieces){if(ids.has(p.piece_id))throw Error('DUPLICATE_PIECE_ID');ids.add(p.piece_id);area+=P.normalize(p.occupied_cells).length;}
 if(area!==level.w*level.h)throw Error('AREA_MISMATCH');return true;
}
function signature(level){return JSON.stringify({w:level.w,h:level.h,blocked:level.blocked.map(key).sort(),shapes:level.pieces.map(p=>orientations(p.occupied_cells).map(o=>JSON.stringify(o.cells)).sort()[0]).sort()});}
function solve(level,cap=10000){
 const placements=level.pieces.map(p=>orientations(p.occupied_cells).flatMap(({rot,cells})=>{const [w,h]=dims(cells),out=[];for(let y=0;y<=level.h-h;y++)for(let x=0;x<=level.w-w;x++){const k=cells.map(([a,b])=>key([a+x,b+y]));if(k.every(s=>!level.blocked.some(b=>key(b)===s)))out.push({piece_id:p.piece_id,rot,at:[x,y],keys:k,rank:rot+':'+y+':'+x});}return out;}));
 const used=new Set(level.blocked.map(key)),path=[],first=[],equiv=level.pieces.map(p=>orientations(p.occupied_cells).map(o=>JSON.stringify(o.cells)).sort()[0]);let count=0,nodes=0,capped=false;
 function dfs(i){if(count>=cap){capped=true;return;}nodes++;if(i===level.pieces.length){if(used.size===level.w*level.h){count++;if(!first.length)first.push(...path.map(p=>({piece_id:p.piece_id,rot:p.rot,at:p.at})));}return;}
 const prior=equiv.slice(0,i).lastIndexOf(equiv[i]);
 for(const place of placements[i]){if(prior>=0&&place.rank<=path[prior].rank)continue;if(place.keys.some(k=>used.has(k)))continue;place.keys.forEach(k=>used.add(k));path.push(place);dfs(i+1);path.pop();place.keys.forEach(k=>used.delete(k));if(capped)return;}}
 dfs(0);return {solution_count:count,count_status:capped?'CAPPED_LOWER_BOUND':'FULL_EXACT',cap,search_nodes:nodes,placement_options:placements.map(p=>p.length),solution:first};
}
return {shape,dims,valid,complete,orientations,validate,signature,solve};
});
