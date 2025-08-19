(function(){
  'use strict';
  window.Game = window.Game || {};
  const Game = window.Game;

  let gifts = [];
  let candies = [];
  let orbs = [];
  let raycaster, mouse;

  const MESSAGES = [
    "💖 Happy Birthday Guddu — you are my favorite person in the universe!",
    "✨ Your smile lights up every street in this city.",
    "🌸 You make ordinary moments feel magical.",
    "🌙 With you, even the night sky blushes.",
    "🎁 Wishing you joy, love, and endless adventures!",
    "🦋 You’re the calm and the sparkle in my days.",
    "🌈 Every path with you glows brighter."
  ];

  function makeGift(x,z){
    const box = new THREE.Mesh(new THREE.BoxGeometry(3,3,3), new THREE.MeshPhongMaterial({ color:0xffd54f, emissive:0x2b2000, shininess:60 }));
    box.position.set(x, 1.5, z); box.castShadow = true; box.receiveShadow = true;
    const ribbon1 = new THREE.Mesh(new THREE.BoxGeometry(3.2,0.4,0.6), new THREE.MeshPhongMaterial({ color:0xff3b6b }));
    const ribbon2 = new THREE.Mesh(new THREE.BoxGeometry(0.6,0.4,3.2), new THREE.MeshPhongMaterial({ color:0xff3b6b }));
    ribbon1.position.set(0, 1.8, 0); ribbon2.position.set(0, 1.8, 0); box.add(ribbon1); box.add(ribbon2);
    return box;
  }

  function makeCandy(x,z){
    const group = new THREE.Group();
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.9, 16,16), new THREE.MeshPhongMaterial({ color: new THREE.Color().setHSL(Math.random(),0.7,0.6) }));
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.08,1.2,8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    body.position.y = 0.9; stick.position.y = 0.2;
    group.add(body); group.add(stick); group.position.set(x, 1.1, z); group.castShadow = true; group.receiveShadow = true; return group;
  }

  function makeOrb(x,z){
    const g = new THREE.Group();
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16,16), new THREE.MeshBasicMaterial({ color:0xff8ad6 }));
    const glow = new THREE.Mesh(new THREE.SphereGeometry(1.2, 16,16), new THREE.MeshBasicMaterial({ color:0xffb7f0, transparent:true, opacity:0.35 }));
    g.add(glow); g.add(core); g.position.set(x, 2.2, z); return g;
  }

  function confettiBurst(scene, pos){
    const geo = new THREE.BufferGeometry();
    const n = 150;
    const positions = new Float32Array(n*3);
    const velocities = [];
    for(let i=0;i<n;i++){
      positions.set([pos.x, pos.y, pos.z], i*3);
      const dir = new THREE.Vector3(Math.random()*2-1, Math.random()*2-0.2, Math.random()*2-1).normalize();
      velocities.push(dir.multiplyScalar(6+Math.random()*6));
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions,3));
    const mat = new THREE.PointsMaterial({ size: 0.15, transparent:true, opacity:0.9 });
    const pts = new THREE.Points(geo, mat);
    pts.userData.v = velocities;
    let t = 0;
    pts.userData.update = (dt)=>{
      t += dt; const p = pts.geometry.attributes.position;
      for(let i=0;i<n;i++){ const v = velocities[i]; p.array[i*3+0] += v.x*dt; p.array[i*3+1] += v.y*dt - 2*dt; p.array[i*3+2] += v.z*dt; }
      p.needsUpdate = true; if (t>2.2){ scene.remove(pts); }
    };
    scene.add(pts); if (!Game._fx) Game._fx = []; Game._fx.push(pts);
  }

  Game.Gifts = {
    add(scene){
      gifts = []; candies = []; orbs = [];
      const giftPos = [];
      for (let x=-240; x<=240; x+=60){ for (let z=-240; z<=240; z+=60){ if (Math.abs(x)>40 || Math.abs(z)>40) giftPos.push([x+Game.rand(-8,8), z+Game.rand(-8,8)]); }}
      const candyPos = [];
      for (let i=0;i<30;i++) candyPos.push([Game.rand(-260,260), Game.rand(-260,260)]);
      const orbPos = [];
      for (let i=0;i<22;i++) orbPos.push([Game.rand(-260,260), Game.rand(-260,260)]);

      giftPos.slice(0,26).forEach(([x,z])=>{ const g = makeGift(x,z); gifts.push(g); scene.add(g); });
      candyPos.forEach(([x,z])=>{ const c = makeCandy(x,z); candies.push(c); scene.add(c); });
      orbPos.forEach(([x,z])=>{ const o = makeOrb(x,z); orbs.push(o); scene.add(o); });

      raycaster = new THREE.Raycaster(); mouse = new THREE.Vector2();

      window.addEventListener('click', (e)=>{
        if (Game.Controls && Game.Controls.pointerLocked && Game.Controls.pointerLocked()){ mouse.set(0,0); }
        else { mouse.x =  (e.clientX / window.innerWidth) * 2 - 1; mouse.y = -(e.clientY / window.innerHeight) * 2 + 1; }
        const camera = Game._camera, sceneRef = Game._scene; if(!camera) return;
        raycaster.setFromCamera(mouse, camera);
        const targets = gifts.concat(candies).concat(orbs);
        const hits = raycaster.intersectObjects(targets, true);
        if (hits.length){
          const obj = hits[0].object; const root = obj.parent.type === 'Group' ? obj.parent : obj; root.visible = false;
          const msg = MESSAGES[Math.floor(Math.random()*MESSAGES.length)];
          Game.toast(msg, 3200);
          confettiBurst(sceneRef, root.position.clone().add(new THREE.Vector3(0,1.5,0)));
        }
      });
    },
    update(dt){
      const t = Date.now()*0.001;
      gifts.forEach(g=>{ if (g.visible){ g.position.y = 1.5 + Math.sin(t*1.4 + g.position.x*0.05)*0.25; } });
      candies.forEach(c=>{ if (c.visible){ c.rotation.y += 0.8*dt; c.position.y = 1.1 + Math.sin(t*2.0 + c.position.z*0.05)*0.2; } });
      orbs.forEach(o=>{ if (o.visible){ o.rotation.y += 0.6*dt; o.position.y = 2.2 + Math.sin(t*1.8 + o.position.x*0.03)*0.3; } });

      if (Game._fx && Game._fx.length){ Game._fx.forEach(fx => fx.userData.update && fx.userData.update(dt)); Game._fx = Game._fx.filter(fx => fx.parent); }
    }
  };
})();