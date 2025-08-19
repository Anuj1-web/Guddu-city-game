(function(){
  'use strict';
  window.Game = window.Game || {};
  const Game = window.Game;

  const state = {
    keys: { up:false, down:false, left:false, right:false },
    hasPointerLock: false,
    controls: null,
    speed: 18,
    height: 3
  };

  function onKey(e, down){
    switch(e.code){
      case 'KeyW': case 'ArrowUp':    state.keys.up = down; break;
      case 'KeyS': case 'ArrowDown':  state.keys.down = down; break;
      case 'KeyA': case 'ArrowLeft':  state.keys.left = down; break;
      case 'KeyD': case 'ArrowRight': state.keys.right = down; break;
    }
  }

  function setupPointerLock(camera){
    const plc = new THREE.PointerLockControls(camera, document.body);
    state.controls = plc;
    const clickToLock = () => plc.lock();
    document.body.addEventListener('click', clickToLock);
    plc.addEventListener('lock',  ()=> state.hasPointerLock = true);
    plc.addEventListener('unlock',()=> state.hasPointerLock = false);
    camera.position.set(0, state.height, 12);
  }

  function setupKeyboard(){
    document.addEventListener('keydown', e => onKey(e, true));
    document.addEventListener('keyup',   e => onKey(e, false));
  }

  function setupDpad(){
    const dpad = document.getElementById('dpad');
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      dpad.style.display = 'block';
    }
    const set = (dir, val) => { state.keys[dir] = val; };
    const bind = (el, dir) => {
      const start = (e)=>{ e.preventDefault(); set(dir,true); };
      const end   = (e)=>{ e.preventDefault(); set(dir,false); };
      el.addEventListener('touchstart', start, {passive:false});
      el.addEventListener('touchend',   end,   {passive:false});
      el.addEventListener('mousedown',  start);
      el.addEventListener('mouseup',    end);
      el.addEventListener('mouseleave', end);
    };
    bind(document.querySelector('.pad.up'), 'up');
    bind(document.querySelector('.pad.down'), 'down');
    bind(document.querySelector('.pad.left'), 'left');
    bind(document.querySelector('.pad.right'), 'right');
  }

  Game.Controls = {
    init(camera){
      setupPointerLock(camera);
      setupKeyboard();
      setupDpad();
    },
    getMoveDelta(camera, dt){
      const v = new THREE.Vector3();
      const forward = new THREE.Vector3();
      const right = new THREE.Vector3();

      camera.getWorldDirection(forward);
      forward.y = 0; forward.normalize();
      right.crossVectors(forward, new THREE.Vector3(0,1,0)).negate().normalize();

      const s = state.speed * dt;
      if (state.keys.up)    v.addScaledVector(forward,  s);
      if (state.keys.down)  v.addScaledVector(forward, -s);
      if (state.keys.left)  v.addScaledVector(right,   -s);
      if (state.keys.right) v.addScaledVector(right,    s);
      return v;
    },
    pointerLocked(){ return state.hasPointerLock; },
    height(){ return state.height; }
  };

})();