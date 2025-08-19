(function(){
  'use strict';
  window.Game = window.Game || {};
  const Game = window.Game;

  let fireflies = [];
  let dust;

  function makeFirefly(){
    const geo = new THREE.SphereGeometry(0.05, 8, 8);
    const mat = new THREE.MeshBasicMaterial({ color: 0xfff7a8 });
    const m = new THREE.Mesh(geo, mat);
    m.position.set(Game.rand(-300,300), Game.rand(1.5, 3.5), Game.rand(-300,300));
    return m;
  }

  function makeDust(){
    const count = 4000;
    const pos = new Float32Array(count*3);
    for(let i=0;i<count;i++){ pos[i*3+0]=Game.rand(-600,600); pos[i*3+1]=Game.rand(0.5,4.0); pos[i*3+2]=Game.rand(-600,600); }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
    const mat = new THREE.PointsMaterial({ size: 0.06, transparent:true, opacity:0.5, color:0xffffff, depthWrite:false });
    return new THREE.Points(geo, mat);
  }

  Game.Particles = {
    add(scene){
      fireflies = []; for(let i=0;i<160;i++){ const f = makeFirefly(); fireflies.push(f); scene.add(f); }
      dust = makeDust(); scene.add(dust);
    },
    update(dt){
      const t = Date.now()*0.001;
      fireflies.forEach((f,i)=>{
        f.position.x += Math.sin(t*1.2 + i)*0.02;
        f.position.z += Math.cos(t*1.1 + i)*0.02;
        f.position.y += Math.sin(t*2.0 + i)*0.01;
      });
      if (dust){ dust.rotation.y += 0.002*dt; }
    }
  };
})();