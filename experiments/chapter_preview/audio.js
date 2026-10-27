'use strict';
// Set a relative audio URL per animal; null keeps the approved game silent.
const animalClickSounds = {"U5":null,"S4":null,"T4":null,"P5":null,"L4":null,"L3":null,"RECT6":null,"O4":null,"D2":null,"I3":null,"I4":null};
const animalAudio=(()=>{
 const players=new Map();let active=null,last=-Infinity;
 return {
  volume:.6,muted:false,cooldownMs:150,
  stop(){if(active){active.pause();active=null;}},
  setMuted(value){this.muted=!!value;if(this.muted)this.stop();},
  async play(shapeId){
   const src=animalClickSounds[shapeId],now=performance.now();
   if(!src||this.muted||now-last<this.cooldownMs)return false;
   last=now;
   try{
    let player=players.get(src);
    if(!player){player=new Audio(src);player.preload='auto';players.set(src,player);}
    this.stop();active=player;player.currentTime=0;
    player.volume=Math.max(0,Math.min(1,Number(this.volume)||0));
    await player.play();return true;
   }catch{return false;} // Audio failure must never interrupt picking up an animal.
  }
 };
})();
