(function(){
  'use strict';
  window.Game = window.Game || {};
  const Game = window.Game;

  let balloons = [];

  function makeBalloon(){
    const group = new THREE.Group();
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 20, 20),
      new THREE.MeshPhongMaterial({ color: new THREE.Color().setHSL(Math.random(), 0.7, 0.6) })
    );
    sphere.castShadow = true; sphere.receiveShadow = false;
    group.add(sphere);

    const string = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03,0.03,2, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    string.position.y = -1.6;
    group.add(string);

    group.position.set(Game.rand(-150,150), Game.rand(6,14), Game.rand(-150,150));
    return group;
  }

  Game.Particles = {
    add(scene){
      balloons = [];
      for (let i=0;i<20;i++){
        const b = makeBalloon();
        balloons.push(b); scene.add(b);
      }
    },
    update(dt){
      const t = Date.now()*0.001;
      balloons.forEach((b, i)=>{
        b.position.y += Math.sin(t + i)*0.02 + 0.015;
        b.position.x += Math.sin(t*0.3 + i)*0.02;
        b.position.z += Math.cos(t*0.25 + i)*0.02;
      });
    }
  };

})();