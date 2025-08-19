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

  function materialFor(pathList){
    const mat = new THREE.MeshBasicMaterial({ transparent:false });
    Game.safeLoadTexture(pathList, (tex)=>{ mat.map = tex; mat.needsUpdate = true; });
    return mat;
  }

  Game.Hoardings = {
    add(scene){
      const group = new THREE.Group();
      group.name = 'Hoardings';
      const positions = [
        new THREE.Vector3(-160, 22, -100),
        new THREE.Vector3(-80,  22, -100),
        new THREE.Vector3(0,    22, -100),
        new THREE.Vector3(80,   22, -100),
        new THREE.Vector3(160,  22, -100),
      ];

      function candidates(name){
        return [
          name
        ];
      }

      mats = [];
      positions.forEach((p, i)=>{
        const geo = new THREE.PlaneGeometry(40, 24);
        const mat = materialFor(candidates(imageNames[(i)%imageNames.length]));
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.copy(p);
        mesh.lookAt(new THREE.Vector3(p.x, p.y, p.z+1));
        group.add(mesh);
        mats.push(mat);

        const frame = new THREE.Mesh(new THREE.PlaneGeometry(41, 25), new THREE.MeshBasicMaterial({color:0x111418}));
        frame.position.copy(p); frame.position.z += 0.01;
        frame.lookAt(new THREE.Vector3(p.x, p.y, p.z+1));
        group.add(frame);
      });
      scene.add(group);
    },
    update(dt){
      timer += dt;
      if (timer > 3){
        timer = 0;
        slideIndex = (slideIndex + 1) % imageNames.length;
        const name = imageNames[slideIndex];
        const paths = [name];
        mats.forEach(m => {
          Game.safeLoadTexture(paths, (tex)=>{ m.map = tex; m.needsUpdate = true; });
        });
      }
    }
  };

})();