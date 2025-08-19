(function(){
  'use strict';
  window.Game = window.Game || {};
  const Game = window.Game;

  let gifts = [];
  let raycaster, mouse;

  const MESSAGES = [
    "🎁 Happy Birthday Guddu! You light up every street in my city 💖",
    "🎁 Your smile is the billboard of my heart — always shining!",
    "🎁 May your day be magical, bright, and full of love ✨",
    "🎁 Every step with you feels like fireworks in the sky 🌟",
    "🎁 Stay blessed, my sunshine — always and forever 💫"
  ];

  function makeGift(x,z){
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(3,3,3),
      new THREE.MeshPhongMaterial({ color:0xffd54f, emissive:0x3b2f00, shininess:40 })
    );
    box.position.set(x, 1.5, z);
    box.castShadow = true; box.receiveShadow = true;

    const ribbon = new THREE.Mesh(
      new THREE.BoxGeometry(3.2,0.4,0.6),
      new THREE.MeshPhongMaterial({ color:0xff3b6b })
    );
    ribbon.position.set(0, 1.8, 0);
    box.add(ribbon);

    return box;
  }

  Game.Gifts = {
    add(scene){
      gifts = [];
      const positions = [
        [-50,-30],[30,40],[120,-60],[-140,80],[60, -120],[ -90, 130]
      ];
      positions.forEach(([x,z])=>{
        const g = makeGift(x,z);
        gifts.push(g); scene.add(g);
      });
      raycaster = new THREE.Raycaster();
      mouse = new THREE.Vector2();

      window.addEventListener('click', (e)=>{
        if (Game.Controls && Game.Controls.pointerLocked && Game.Controls.pointerLocked()){
          mouse.set(0,0);
        } else {
          mouse.x =  (e.clientX / window.innerWidth) * 2 - 1;
          mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        }
        const camera = Game._camera;
        if(!camera) return;
        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects(gifts, false);
        if (hits.length){
          const obj = hits[0].object;
          obj.visible = false;
          const msg = MESSAGES[Math.floor(Math.random()*MESSAGES.length)];
          Game.toast(msg, 2600);
        }
      });
    },
    update(dt){
      gifts.forEach(g=>{
        if (g.visible){
          g.position.y = 1.5 + Math.sin(Date.now()*0.002 + g.position.x*0.1)*0.3;
        }
      });
    }
  };

})();