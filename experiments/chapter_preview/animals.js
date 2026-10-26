'use strict';
// Only exact HUMAN-approved originals. Missing shapes retain atomic geometry placeholders.
const chapterAnimals={
 U5:{src:'../../assets/animals/snake_u5_final_g3.png?v=0fdb68ffa5a76ca6',sha256:'0fdb68ffa5a76ca6200c0b5602ed1e49d526bc9d62ae5deaf51fd978df6c9379',version:'U5_SNAKE_LEFT_HEAD_RAISED_candidate_final_G3',baseSize:[3,2]},
 S4:{src:'../../assets/animals/squirrel_s4_clean_g3.png?v=e68f4b6f68a56e78',sha256:'e68f4b6f68a56e78716a04e0d5c81b827a19f67aa473b3308fe820c4f6c70440',version:'S4_SQUIRREL_ACORN_GIANT_TAIL_CLEAN_G3',baseSize:[3,2],offsetCells:[-.2,0]},
 T4:{src:'../../assets/animals/owl_t4_wide_g3.png?v=c57b9af6ed27ce22',sha256:'c57b9af6ed27ce2254aadf328720553899d2749b5056996412790f6700b9144c',version:'T4_OWL_WIDE_WINGS_LARGE_TAIL_G3',baseSize:[3,2]}
};
const chapterAnimalImages={};
const chapterArtReady=Promise.all(Object.entries(chapterAnimals).map(([id,asset])=>new Promise(resolve=>{
 const image=new Image();chapterAnimalImages[id]=image;
 image.onload=()=>resolve({id,ok:true});image.onerror=()=>resolve({id,ok:false});image.src=asset.src;
})));
function animalRect(p,unit){
 const asset=chapterAnimals[p.shape_id],image=chapterAnimalImages[p.shape_id];
 if(!asset||!image?.naturalWidth)return null;
 const [w,h]=asset.baseSize,scale=Math.min(w*unit/image.naturalWidth,h*unit/image.naturalHeight);
 return {image,w:image.naturalWidth*scale,h:image.naturalHeight*scale};
}
function drawAnimal(context,p,x,y,unit){
 const r=animalRect(p,unit);if(!r)return false;
 const [w,h]=PuzzleGeometry.dims(PuzzleGeometry.shape(p));
 context.save();context.translate(x+w*unit/2,y+h*unit/2);context.rotate((p.rot||0)*Math.PI/2);
 // One drawImage of the entire original, with uniform scale. No per-cell crop/mask.
 // Local-space display anchor follows the same quarter-turn as the whole animal.
 const offset=chapterAnimals[p.shape_id].offsetCells||[0,0];
 context.drawImage(r.image,-r.w/2+offset[0]*unit,-r.h/2+offset[1]*unit,r.w,r.h);context.restore();return true;
}
