(function(){
  'use strict';
  window.Game = window.Game || {};
  const Game = window.Game;

  Game.clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  Game.rand = (min, max) => min + Math.random()*(max-min);
  Game.lerp = (a,b,t)=> a + (b-a)*t;

  Game.toast = function(text, ms=2600){
    const el = document.getElementById('message');
    if(!el) return;
    el.textContent = text;
    el.style.display = 'block';
    clearTimeout(el._t);
    el._t = setTimeout(()=>{ el.style.display='none'; }, ms);
  };

  Game.makeTextTexture = function(title, subtitle){
    const size = 1024, c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    // gradient background
    const g = ctx.createLinearGradient(0,0,size,size);
    g.addColorStop(0, '#1a2a40'); g.addColorStop(1, '#0d1320');
    ctx.fillStyle = g; ctx.fillRect(0,0,size,size);

    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.font = 'bold 90px system-ui, sans-serif';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(title, size/2, size/2 - 80);

    if (subtitle) {
      ctx.fillStyle = 'rgba(173, 212, 255, 0.95)';
      ctx.font = '600 56px system-ui, sans-serif';
      ctx.fillText(subtitle, size/2, size/2 + 50);
    }

    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = Game.maxAniso || 4;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  };

  Game.safeLoadTexture = function(path, onLoad){
    const loader = new THREE.TextureLoader();
    loader.load(path, (tex)=>{
      tex.anisotropy = Game.maxAniso || 4;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      onLoad(tex);
    }, undefined, ()=>{
      // fallback
      onLoad(Game.makeTextTexture('Image Missing', 'check filename'));
    });
  };
})();