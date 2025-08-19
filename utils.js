(function(){
  'use strict';
  window.Game = window.Game || {};

  const Game = window.Game;

  Game.clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  Game.rand = (min, max) => min + Math.random()*(max-min);

  Game.toast = function(text, ms=2200){
    const el = document.getElementById('message');
    if(!el) return;
    el.textContent = text;
    el.style.display = 'block';
    clearTimeout(el._t);
    el._t = setTimeout(()=>{ el.style.display='none'; }, ms);
  };

  Game.makeLabelTexture = function(text='TEXTURE', bg1='#1f2a44', bg2='#0d1320'){
    const size = 512;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    const g = ctx.createLinearGradient(0,0,size,size);
    g.addColorStop(0, bg1);
    g.addColorStop(1, bg2);
    ctx.fillStyle = g; ctx.fillRect(0,0,size,size);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 2;
    for (let i=-size; i<size*2; i+=24){
      ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i-size,size); ctx.stroke();
    }
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = 'bold 44px system-ui, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(text, size/2, size/2);
    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 4;
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  };

  Game.safeLoadTexture = function(paths, onLoad){
    const loader = new THREE.TextureLoader();
    const list = Array.isArray(paths) ? paths.slice() : [paths];
    let done = false;
    function tryNext(){
      if(!list.length){
        onLoad(Game.makeLabelTexture('MISSING IMAGE'));
        return;
      }
      const p = list.shift();
      loader.load(
        p,
        tex => { if(!done){ done=true; tex.anisotropy=4; onLoad(tex); } },
        undefined,
        () => { tryNext(); }
      );
    }
    tryNext();
  };

})();