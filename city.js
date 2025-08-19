(function(){
  'use strict';
  window.Game = window.Game || {};
  const Game = window.Game;

  let scene, camera, renderer;
  let last = 0;

  function makeRenderer(){
    renderer = new THREE.WebGLRenderer({ antialias:true, powerPreference:'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);
    Game._renderer = renderer;
    Game.maxAniso = renderer.capabilities.getMaxAnisotropy();
  }

  function makeCamera(){
    camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.1, 2400);
    Game._camera = camera;
  }

  function makeLights(){
    const hemi = new THREE.HemisphereLight(0xcfe6ff, 0x10131a, 0.85);
    scene.add(hemi);

    const sun = new THREE.DirectionalLight(0xffffff, 1.0);
    sun.position.set(-160, 220, 120);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 1200;
    sun.shadow.camera.left = -380;
    sun.shadow.camera.right = 380;
    sun.shadow.camera.top = 380;
    sun.shadow.camera.bottom = -380;
    scene.add(sun);
  }

  function makeGroundAndRoads(){
    const g = new THREE.PlaneGeometry(2000, 2000);
    const groundMat = new THREE.MeshPhongMaterial({ color: 0x1a202c, shininess: 14 });
    const ground = new THREE.Mesh(g, groundMat);
    ground.rotation.x = -Math.PI/2;
    ground.receiveShadow = true;
    scene.add(ground);

    const roadMat = new THREE.MeshLambertMaterial({ color: 0x0f1217 });
    for (let i=-5; i<=5; i++){
      const roadZ = new THREE.Mesh(new THREE.BoxGeometry(2000, 0.2, 22), roadMat);
      roadZ.position.set(0, 0.09, i*120);
      roadZ.receiveShadow = true; scene.add(roadZ);

      const roadX = new THREE.Mesh(new THREE.BoxGeometry(22, 0.2, 2000), roadMat);
      roadX.position.set(i*120, 0.09, 0);
      roadX.receiveShadow = true; scene.add(roadX);
    }

    const lineMat = new THREE.MeshBasicMaterial({ color: 0xf9fbff });
    for (let i=-5; i<=5; i++){
      for (let k=-18; k<=18; k++){
        const dash = new THREE.Mesh(new THREE.BoxGeometry(10, 0.21, 1.2), lineMat);
        dash.position.set(k*60, 0.11, i*120); scene.add(dash);

        const dash2 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.21, 10), lineMat);
        dash2.position.set(i*120, 0.11, k*60); scene.add(dash2);
      }
    }
  }

  function randomBuildingColor(){
    const palette = [0x2a3243, 0x334155, 0x3b4a63, 0x475569, 0x5b6b80, 0x6b7c92];
    return palette[(Math.random()*palette.length)|0];
  }

  function makeBuildings(){
    const blocks = [];
    for (let gx=-4; gx<=4; gx++){
      for (let gz=-4; gz<=4; gz++){
        if (gx === 0 || gz === 0) continue;
        const cx = gx*120, cz = gz*120;
        blocks.push({cx, cz});
      }
    }

    const group = new THREE.Group();
    group.name = 'Buildings';
    blocks.forEach(({cx, cz})=>{
      const count = 20 + (Math.random()*10|0);
      for (let i=0;i<count;i++){
        const w = Game.rand(10, 30);
        const d = Game.rand(10, 30);
        const h = Game.rand(28, 160);
        const x = cx + Game.rand(-55, 55);
        const z = cz + Game.rand(-55, 55);

        const geo = new THREE.BoxGeometry(w, h, d);
        const mat = new THREE.MeshPhongMaterial({
          color: randomBuildingColor(),
          emissive: 0x0a0c12,
          shininess: 22,
          specular: 0x8898a6
        });
        const b = new THREE.Mesh(geo, mat);
        b.position.set(x, h/2, z);
        b.castShadow = true; b.receiveShadow = true;

        if (h > 36){
          const floors = Math.max(2, (h/10)|0);
          const winMat = new THREE.MeshBasicMaterial({ color: 0xfff3c0, transparent:true, opacity: 0.9 });
          for (let f=1; f<floors; f++){
            const p = new THREE.Mesh(new THREE.PlaneGeometry(w*0.92, 0.7), winMat);
            p.position.set(0, (h/floors)*f - h/2 + 0.6, d/2 + 0.01);
            b.add(p);
            const p2 = p.clone(); p2.position.z = -d/2 - 0.01; p2.rotation.y = Math.PI; b.add(p2);
          }
        }
        group.add(b);
      }
    });
    scene.add(group);
  }

  function resize(){
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate(t){
    const now = t*0.001;
    const dt = Math.min(0.05, now - (last||now));
    last = now;

    const delta = Game.Controls.getMoveDelta(camera, dt);
    camera.position.add(delta);
    camera.position.y = Game.Controls.height();

    Game.Sky.update(dt);
    Game.Hoardings.update(dt);
    Game.Gifts.update(dt);
    Game.Particles.update(dt);

    renderer.setClearColor(0x0b1017, 1);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  Game.start = function(){
    scene = new THREE.Scene();
    Game._scene = scene;
    scene.fog = new THREE.FogExp2(0x0b1017, 0.0009);

    makeCamera();
    makeRenderer();
    makeLights();
    Game.Sky.add(scene);
    makeGroundAndRoads();
    makeBuildings();

    Game.Controls.init(camera);
    Game.Hoardings.add(scene);
    Game.Gifts.add(scene);
    Game.Particles.add(scene);

    window.addEventListener('resize', resize);
    requestAnimationFrame(animate);
  };

})();