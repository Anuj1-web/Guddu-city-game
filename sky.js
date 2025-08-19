(function(){
  'use strict';
  window.Game = window.Game || {};
  const Game = window.Game;

  let skyDay, skyNight, stars, clouds;
  let mode = 'night'; // 'day' | 'night'
  let blend = 1.0; // 0 = day, 1 = night

  function makeSkySphere(colors){
    const geo = new THREE.SphereGeometry(1200, 40, 20);
    const c = document.createElement('canvas'); c.width = c.height = 1024;
    const ctx = c.getContext('2d');
    const g = ctx.createLinearGradient(0,0,0,1024);
    colors.forEach(([stop, col])=> g.addColorStop(stop, col));
    ctx.fillStyle = g; ctx.fillRect(0,0,1024,1024);
    const tex = new THREE.CanvasTexture(c);
    return new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide, transparent:true, opacity:1 }));
  }

  function makeStars(){
    const geo = new THREE.BufferGeometry();
    const count = 2600;
    const pos = new Float32Array(count*3);
    for (let i=0;i<count;i++){
      const r = 1180 + Math.random()*10;
      const theta = Math.random()*Math.PI*2;
      const phi = Math.acos(2*Math.random()-1);
      pos[i*3+0] = r * Math.sin(phi) * Math.cos(theta);
      pos[i*3+1] = r * Math.cos(phi);
      pos[i*3+2] = r * Math.sin(phi) * Math.sin(theta);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
    const mat = new THREE.PointsMaterial({ size: 1.2, sizeAttenuation: true, color: 0xcfe2ff, transparent:true, opacity:1 });
    return new THREE.Points(geo, mat);
  }

  function makeClouds(){
    const g = new THREE.Group();
    for(let i=0;i<24;i++){
      const p = new THREE.Mesh(new THREE.PlaneGeometry(220, 120),
        new THREE.MeshBasicMaterial({ color:0xffffff, transparent:true, opacity:0.12, depthWrite:false }));
      p.position.set(Game.rand(-800,800), Game.rand(120,220), Game.rand(-800,800));
      p.rotation.y = Math.random()*Math.PI*2;
      g.add(p);
    }
    return g;
  }

  Game.Sky = {
    add(scene){
      skyDay = makeSkySphere([[0,'#96c8ff'],[0.6,'#6ea8ff'],[1,'#bfe3ff']]);
      skyNight = makeSkySphere([[0,'#0e1230'],[0.55,'#0a0f22'],[1,'#070b16']]);
      skyNight.opacity = 1; skyDay.opacity = 0;
      scene.add(skyDay); scene.add(skyNight);
      stars = makeStars(); scene.add(stars);
      clouds = makeClouds(); scene.add(clouds);
    },
    update(dt){
      // blend towards mode
      const target = (mode === 'night') ? 1 : 0;
      blend = Game.lerp(blend, target, 0.02);
      skyNight.material.opacity = blend;
      skyDay.material.opacity   = 1 - blend;
      stars.material.opacity    = blend;

      // gentle motion
      stars.rotation.y += 0.003*dt;
      clouds.children.forEach((p,i)=>{ p.position.x += 0.6*dt; p.rotation.z += 0.001*(i%5); if(p.position.x>900) p.position.x=-900; });
    },
    toggleMode(){ mode = (mode === 'night') ? 'day' : 'night'; Game.toast(mode==='night'?'Night mode 🌙':'Day mode ☀️'); },
    currentMode(){ return mode; }
  };
})();