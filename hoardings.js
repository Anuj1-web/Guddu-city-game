(function(){
  'use strict';
  window.Game = window.Game || {};
  const Game = window.Game;

  const imageNames = [
    "IMG-20250304-WA0006.jpg",
    "IMG-20250304-WA0010.jpg",
    "IMG-20250304-WA0011.jpg",
    "IMG-20250815-WA0000.jpg",
    "IMG-20250815-WA0001.jpg",
    "IMG-20250815-WA0003.jpg",
    "IMG-20250815-WA0008.jpg",
    "IMG-20250815-WA0009.jpg",
    "IMG-20250815-WA0010.jpg",
    "IMG-20250815-WA0011.jpg"
  ];

  let mats = [];
  let slideIndex = 0;
  let timer = 0;

  function photoMaterial(image){ // loads with crisp filters
    const m = new THREE.MeshBasicMaterial({ transparent:false });
    Game.safeLoadTexture(image, (tex)=>{ m.map = tex; m.needsUpdate = true; });
    return m;
  }

  function textMaterial(title, subtitle){
    return new THREE.MeshBasicMaterial({ map: Game.makeTextTexture(title, subtitle) });
  }

  function addBoard(scene, position, isPhoto, idx){
    const geo = new THREE.PlaneGeometry(40, 24);
    const mat = isPhoto ? photoMaterial(imageNames[idx % imageNames.length]) :
      textMaterial("Happy Birthday Guddu", "You light up my world 💖");
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(position);
    mesh.lookAt(new THREE.Vector3(position.x, position.y, position.z+1));
    scene.add(mesh);
    mats.push(mat);

    const frame = new THREE.Mesh(new THREE.PlaneGeometry(41, 25), new THREE.MeshBasicMaterial({ color: 0x80d0ff, transparent:true, opacity:0.22 }));
    frame.position.copy(position); frame.position.z += 0.02;
    frame.lookAt(new THREE.Vector3(position.x, position.y, position.z+1));
    scene.add(frame);
  }

  Game.Hoardings = {
    add(scene){
      mats = [];
      const positions = [];
      // distribute hoardings along the outer ring and some inner spots
      const rings = [180, 240, 300];
      rings.forEach(r => {
        for(let a=0; a<360; a+=30){
          const rad = a*Math.PI/180;
          positions.push(new THREE.Vector3(Math.cos(rad)*r, 22, Math.sin(rad)*r));
        }
      });
      // add 5 inner cross-road boards
      [-180,0,180].forEach(x=>[-180,0,180].forEach(z=> positions.push(new THREE.Vector3(x, 22, z))));

      positions.forEach((p, i)=> addBoard(scene, p, i%2===0, i));
    },
    update(dt){
      timer += dt;
      if (timer > 3.5){
        timer = 0;
        slideIndex = (slideIndex + 1) % imageNames.length;
        const name = imageNames[slideIndex];
        mats.forEach((m, i) => {
          if (!m.map || m.map.image && m.map.image.tagName !== 'CANVAS'){ // only update photo boards
            Game.safeLoadTexture(name, (tex)=>{ m.map = tex; m.needsUpdate = true; });
          }
        });
      }
    }
  };
})();