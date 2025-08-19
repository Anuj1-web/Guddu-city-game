(function(){
  'use strict';
  window.Game = window.Game || {};

  // Namespace
  const Game = window.Game;

  // Simple helpers
  Game.clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  // Creates a fallback texture (so we never see purple/black)
  Game.makeFallbackTexture = function(text='TEXTURE'){
    const size = 256;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    // gradient bg
    const g = ctx.createLinearGradient(0,0,size,size);
    g.addColorStop(0, '#1f2a44');
    g.addColorStop(1, '#0d1320');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,size,size);
    // diagonal lines
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 2;
    for (let i=-size; i<size*2; i+=24){
      ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i-size,size); ctx.stroke();
    }
    // text
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, size/2, size/2);
    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 4;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  };

  // Safe loader: tries to load, falls back to generated texture if fails
  Game.safeLoadTexture = function(url, onLoad){
    const loader = new THREE.TextureLoader();
    loader.load(
      url,
      tex => { tex.anisotropy = 4; onLoad(tex); },
      undefined,
      () => { onLoad(Game.makeFallbackTexture('MISSING')); }
    );
  };

  // Simple RNG helper for city gen
  Game.rand = (min, max) => min + Math.random()*(max-min);

})();
