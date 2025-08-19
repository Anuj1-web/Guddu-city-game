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
  }

  function makeCamera(){
    camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.1, 2000);
    Game._camera = camera;
  }

  function makeLights(){
    const hemi = new THREE.HemisphereLight(0xbfd4ff, 0x1a1f2b, 0.9);
    scene.add(hemi);

    const sun = new THREE.DirectionalLight(0xffffff, 0.9);
    sun.position.set(-120, 180, 90);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 600;
    sun.shadow.camera.left = -200;
    sun.shadow.camera.right = 200;
    sun.shadow.camera.top = 200;
    sun.shadow.camera.bottom = -200;
    scene.add(sun);
  }

  function makeGroundAndRoads(){
    const g = new THREE.PlaneGeometry(1200, 1200);
    const groundMat = new THREE.MeshPhongMaterial({ color: 0x1d2330, shininess: 12 });
    const ground = new THREE.Mesh(g, groundMat);
    ground.rotation.x = -Math.PI/2;
    ground.receiveShadow = true;
    scene.add(ground);

    const roadMat = new THREE.MeshLambertMaterial({ color: 0x111417 });
    for (let i=-3; i<=3; i++){
      const roadZ = new THREE.Mesh(new THREE.BoxGeometry(1200, 0.2, 20), roadMat);
      roadZ.position.set(0, 0.1, i*100);
      roadZ.receiveShadow = true; scene.add(roadZ);

      const roadX = new THREE.Mesh(new THREE.BoxGeometry(20, 0.2, 1200), roadMat);
      roadX.position.set(i*100, 0.1, 0);
      roadX.receiveShadow = true; scene.add(roadX);
    }

    const lineMat = new THREE.MeshBasicMaterial({ color: 0xf0f7ff });
    for (let i=-3; i<=3; i++){
      for (let k=-10; k<=10; k++){
        const dash = new THREE.Mesh(new THREE.BoxGeometry(8, 0.21, 1), lineMat);
        dash.position.set(k*50, 0.11, i*100); scene.add(dash);

        const dash2 = new THREE.Mesh(new THREE.BoxGeometry(1, 0.21, 8), lineMat);
        dash2.position.set(i*100, 0.11, k*50); scene.add(dash2);
      }
    }
  }

  function randomBuildingColor(){
    const palette = [0x293241, 0x334155, 0x3b4a63, 0x475569, 0x5b6b80, 0x6b7c92];
    return palette[(Math.random()*palette.length)|0];
  }

  function makeBuildings(){
    const blocks = [];
    for (let gx=-3; gx<=3; gx++){
      for (let gz=-3; gz<=3; gz++){
        if (gx === 0 || gz === 0) continue;
        const cx = gx*100, cz = gz*100;
        blocks.push({cx, cz});
      }
    }

    const group = new THREE.Group();
    group.name = 'Buildings';
    blocks.forEach(({cx, cz})=>{
      const count = 12 + (Math.random()*8|0);
      for (let i=0;i<count;i++){
        const w = Game.rand(8, 20);
        const d = Game.rand(8, 20);
        const h = Game.rand(18, 110);
        const x = cx + Game.rand(-40, 40);
        const z = cz + Game.rand(-40, 40);

        const geo = new THREE.BoxGeometry(w, h, d);
        const mat = new THREE.MeshPhongMaterial({
          color: randomBuildingColor(),
          emissive: 0x0a0c12,
          shininess: 18
        });
        const b = new THREE.Mesh(geo, mat);
        b.position.set(x, h/2, z);
        b.castShadow = true; b.receiveShadow = true;

        if (h > 40){
          const floors = Math.max(2, (h/10)|0);
          const winMat = new THREE.MeshBasicMaterial({ color: 0xfff0c2 });
          for (let f=1; f<floors; f++){
            const p = new THREE.Mesh(new THREE.PlaneGeometry(w*0.9, 0.6), winMat);
            p.position.set(0, (h/floors)*f - h/2 + 0.5, d/2 + 0.01);
            b.add(p);

            const p2 = p.clone();
            p2.position.z = -d/2 - 0.01;
            p2.rotation.y = Math.PI;
            b.add(p2);
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

    Game.Hoardings.update(dt);
    Game.Gifts.update(dt);
    Game.Particles.update(dt);

    renderer.setClearColor(0x0b1017, 1);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  Game.start = function(){
    scene = new THREE.Scene();
    makeCamera();
    makeRenderer();
    makeLights();
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