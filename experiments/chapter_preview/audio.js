'use strict';
// Approved click clips by shape; null disables an individual animal voice.
const animalClickSounds = {"U5":"../../assets/audio/snake_click_v1.wav","S4":"../../assets/audio/squirrel_click_v1.wav","T4":"../../assets/audio/owl_click_v1.wav","P5":"../../assets/audio/hippo_click_v1.wav","L4":"../../assets/audio/giraffe_click_v1.wav","L3":"../../assets/audio/call_duck_click_v1.wav","RECT6":"../../assets/audio/panda_click_v1.wav","O4":"../../assets/audio/rabbit_click_v1.wav","D2":"../../assets/audio/guinea_pig_click_v1.wav","I3":"../../assets/audio/otter_click_v1.wav","I4":"../../assets/audio/crocodile_click_v1.wav"};
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
