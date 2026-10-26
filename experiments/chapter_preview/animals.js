'use strict';
// Only exact HUMAN-approved originals. Missing shapes retain atomic geometry placeholders.
const chapterAnimals={
 U5:{src:'../../assets/animals/snake_u5_final_g3.png?v=0fdb68ffa5a76ca6',sha256:'0fdb68ffa5a76ca6200c0b5602ed1e49d526bc9d62ae5deaf51fd978df6c9379',version:'U5_SNAKE_LEFT_HEAD_RAISED_candidate_final_G3',baseSize:[3,2]},
 S4:{src:'../../assets/animals/squirrel_s4_clean_g3.png?v=e68f4b6f68a56e78',sha256:'e68f4b6f68a56e78716a04e0d5c81b827a19f67aa473b3308fe820c4f6c70440',version:'S4_SQUIRREL_ACORN_GIANT_TAIL_CLEAN_G3',baseSize:[3,2],offsetCells:[-.2,0]},
 T4:{src:'../../assets/animals/owl_t4_wide_g3.png?v=c57b9af6ed27ce22',sha256:'c57b9af6ed27ce2254aadf328720553899d2749b5056996412790f6700b9144c',version:'T4_OWL_WIDE_WINGS_LARGE_TAIL_G3',baseSize:[3,2]},
 P5:{src:'../../assets/animals/hippo_p5_desktop_002.png?v=127c4466453cb349',"sha256":"127c4466453cb349cf718bcb60af36711f82769b042d5067e21b2fed182304b1","version":"P5_DESKTOP_HUMAN_APPROVED_BATCH_002","baseSize":[2,3],"sourceBounds":[10,97,1443,1016],"baseRotation":3},
 L4:{src:'../../assets/animals/giraffe_l4_desktop_002.png?v=722712b83ae53583',"sha256":"722712b83ae535835856d353f7477ff15171f0f57ec7b96330691a0feb61d4ad","version":"L4_DESKTOP_HUMAN_APPROVED_BATCH_002","baseSize":[2,3],"sourceBounds":[413,12,1172,1013],"baseRotation":0,"offsetCells":[0,0.12]},
 L3:{src:'../../assets/animals/call_duck_l3_desktop_002.png?v=3255a1bc5c9a3daa',"sha256":"3255a1bc5c9a3daaecf9b3d2364427237b3e0c6792189ffdff94a25c8a3b0b32","version":"L3_DESKTOP_HUMAN_APPROVED_BATCH_002","baseSize":[2,2],"sourceBounds":[161,15,1354,1082],"baseRotation":0,"offsetCells":[0,0.08]}
};
const chapterAnimalImages={};
const chapterArtReady=Promise.all(Object.entries(chapterAnimals).map(([id,asset])=>new Promise(resolve=>{
 const image=new Image();chapterAnimalImages[id]=image;
 image.onload=()=>resolve({id,ok:true});image.onerror=()=>resolve({id,ok:false});image.src=asset.src;
})));
function animalRect(p,unit){
 const asset=chapterAnimals[p.shape_id],image=chapterAnimalImages[p.shape_id];
 if(!asset||!image?.naturalWidth)return null;
 const [w,h]=asset.baseSize,bounds=asset.sourceBounds||[0,0,image.naturalWidth,image.naturalHeight];
 const bw=bounds[2]-bounds[0],bh=bounds[3]-bounds[1],baseRotation=asset.baseRotation||0;
 const scale=Math.min(w*unit/(baseRotation%2?bh:bw),h*unit/(baseRotation%2?bw:bh));
 return {image,w:image.naturalWidth*scale,h:image.naturalHeight*scale,cx:(bounds[0]+bounds[2])*scale/2,cy:(bounds[1]+bounds[3])*scale/2,baseRotation};
}
function drawAnimal(context,p,x,y,unit){
 const r=animalRect(p,unit);if(!r)return false;
 const [w,h]=PuzzleGeometry.dims(PuzzleGeometry.shape(p));
 context.save();context.translate(x+w*unit/2,y+h*unit/2);context.rotate((p.rot||0)*Math.PI/2);
 // One drawImage of the entire original, with uniform scale. No per-cell crop/mask.
 // Local-space display anchor follows the same quarter-turn as the whole animal.
 const offset=chapterAnimals[p.shape_id].offsetCells||[0,0];
 context.translate(offset[0]*unit,offset[1]*unit);context.rotate(r.baseRotation*Math.PI/2);
 // sourceBounds register transparent padding; the five-argument draw still renders the entire PNG.
 context.drawImage(r.image,-r.cx,-r.cy,r.w,r.h);context.restore();return true;
}
