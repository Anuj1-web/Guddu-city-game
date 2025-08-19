(function(){
  'use strict';
  window.Game = window.Game || {};
  const Game = window.Game;

  let fireflies = [];

  function makeFirefly(){
    const geo = new THREE.SphereGeometry(0.05, 8, 8);
    const mat = new THREE.MeshBasicMaterial({ color: 0xfff7a8 });
    const m = new THREE.Mesh(geo, mat);
    m.position.set(Game.rand(-200,200), Game.rand(1.5, 3.5), Game.rand(-200,200));
    return m;
  }

  Game.Particles = {
    add(scene){
      fireflies = [];
      for(let i=0;i<120;i++){ const f = makeFirefly(); fireflies.push(f); scene.add(f); }
    },
    update(dt){
      const t = Date.now()*0.001;
      fireflies.forEach((f,i)=>{
        f.position.x += Math.sin(t*1.2 + i)*0.015;
        f.position.z += Math.cos(t*1.1 + i)*0.015;
        f.position.y += Math.sin(t*2.0 + i)*0.01;
      });
    }
  };
})();