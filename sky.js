(function(){
  'use strict';
  window.Game = window.Game || {};
  const Game = window.Game;

  let skyMesh, stars;

  function makeGradientSky(){
    const geo = new THREE.SphereGeometry(900, 32, 16);
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    const g = ctx.createLinearGradient(0,0,0,1024);
    g.addColorStop(0, '#0e1230');
    g.addColorStop(0.55, '#0a0f22');
    g.addColorStop(1, '#070b16');
    ctx.fillStyle = g; ctx.fillRect(0,0,1024,1024);
    // few gentle clouds/nebula
    for(let i=0;i<80;i++){
      const x = Math.random()*1024, y = Math.random()*512;
      const r = Math.random()*80 + 40;
      const grd = ctx.createRadialGradient(x,y,0, x,y,r);
      grd.addColorStop(0, 'rgba(160,180,255,0.08)');
      grd.addColorStop(1, 'rgba(160,180,255,0)');
      ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
    }
    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide });
    skyMesh = new THREE.Mesh(geo, mat);
    return skyMesh;
  }

  function makeStars(){
    const geo = new THREE.BufferGeometry();
    const count = 2000;
    const pos = new Float32Array(count*3);
    for (let i=0;i<count;i++){
      const r = 880 + Math.random()*10;
      const theta = Math.random()*Math.PI*2;
      const phi = Math.acos(2*Math.random()-1);
      pos[i*3+0] = r * Math.sin(phi) * Math.cos(theta);
      pos[i*3+1] = r * Math.cos(phi);
      pos[i*3+2] = r * Math.sin(phi) * Math.sin(theta);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
    const mat = new THREE.PointsMaterial({ size: 1.2, sizeAttenuation: true, color: 0xbfd4ff });
    stars = new THREE.Points(geo, mat);
    return stars;
  }

  Game.Sky = {
    add(scene){
      scene.add(makeGradientSky());
      scene.add(makeStars());
    },
    update(dt){
      if (stars){
        stars.rotation.y += 0.002*dt;
      }
    }
  };
})();