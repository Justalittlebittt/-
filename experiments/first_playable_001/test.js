const assert=require('node:assert/strict');const P=require('./core.js');let n=0;function t(name,fn){fn();n++;console.log('PASS '+name)}
t('both levels have exhaustive tiling solutions',()=>P.LEVELS.forEach(l=>assert.equal(P.solve(l),true)));
t('rotation four turns preserves nonmirrored shape',()=>{for(const l of P.LEVELS)for(const p of l.pieces){let c=P.normalize(p.cells);for(let i=0;i<4;i++)c=P.rotate(c,90);assert.deepEqual(c,P.normalize(p.cells));}});
t('inverse rotation',()=>{let c=[[0,0],[0,1],[1,1]];for(const a of [0,90,180,270])assert.deepEqual(P.rotate(P.rotate(c,a),(360-a)%360),P.normalize(c))});
t('bounds and overlap rejected',()=>{let s=P.init();assert.equal(P.valid(s,'A',[0,0]).reason,'OUT_OF_BOUNDS');s=P.move(P.setAngle(s,'A',90),'A',[0,0]).state;assert.equal(P.valid(s,'B',[0,0],90).reason,'OVERLAP');});
t('invalid drop is atomic rollback',()=>{let s=P.init(),v=P.move(s,'A',[0,0]);assert.equal(v.ok,false);assert.equal(v.state,s);});
t('moving already placed piece and rollback',()=>{let s=P.setAngle(P.init(),'A',90);s=P.move(s,'A',[0,0]).state;let old=s;s=P.move(s,'A',[0,1]).state;assert.deepEqual(s.pieces[0].at,[0,1]);assert.equal(P.move(s,'A',[-1,0]).state,s);assert.notEqual(old,s)});
t('level 1 victory and reset',()=>{let s=P.init();s=P.move(P.setAngle(s,'A',90),'A',[0,0]).state;assert.equal(s.completed,false);s=P.move(P.setAngle(s,'B',90),'B',[0,1]).state;assert.equal(s.completed,true);assert.equal(P.init().completed,false)});
t('level 2 proof placements victory',()=>{let s=P.init(1);for(const [id,angle,at] of [['A',90,[0,0]],['B',270,[0,1]],['C',0,[2,0]],['D',0,[3,0]]]){const r=P.move(P.setAngle(s,id,angle),id,at);assert.equal(r.ok,true,id);s=r.state;}assert.equal(s.completed,true)});
t('false victory impossible with omissions',()=>{let s=P.init(1);assert.equal(P.isComplete(s),false);assert.equal(P.LEVELS[1].pieces.reduce((x,p)=>x+p.cells.length,0),12)});
console.log(JSON.stringify({task:'FIRST_PLAYABLE_001',status:'PASS_LOGIC',passed:n,failed:0}));
