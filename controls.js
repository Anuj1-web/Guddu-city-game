(function(){
  'use strict';
  window.Game = window.Game || {};
  const Game = window.Game;

  const state = {
    keys: { up:false, down:false, left:false, right:false },
    hasPointerLock: false,
    speed: 16,
    height: 3,
    vel: new THREE.Vector3(),
    accel: 36,
    damping: 0.90
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
    document.body.addEventListener('click', ()=> plc.lock());
    plc.addEventListener('lock',  ()=> state.hasPointerLock = true);
    plc.addEventListener('unlock',()=> state.hasPointerLock = false);
    camera.position.set(0, state.height, 8);
  }

  function setupKeyboard(){
    document.addEventListener('keydown', e => onKey(e, true));
    document.addEventListener('keyup',   e => onKey(e, false));
  }

  function setupJoystick(){
    const joy = document.getElementById('joystick');
    const stick = document.getElementById('joyStick');
    const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    if (!isTouch) return;
    joy.style.display = 'block';

    let dragging = false;

    function setStick(x, y){
      const dx = Game.clamp(x, 18, 114) - 34;
      const dy = Game.clamp(y, 18, 114) - 34;
      stick.style.left = (dx) + 'px';
      stick.style.top  = (dy) + 'px';
      const nx = (dx-32)/32, ny = (dy-32)/32; // -1..1
      state.keys.up    = ny < -0.2;
      state.keys.down  = ny >  0.2;
      state.keys.left  = nx < -0.2;
      state.keys.right = nx >  0.2;
    }

    function resetStick(){
      stick.style.left = '34px'; stick.style.top = '34px';
      state.keys.up = state.keys.down = state.keys.left = state.keys.right = false;
    }

    const start = ()=>{ dragging = true; };
    const move  = (e)=>{
      if(!dragging) return;
      const t = (e.touches && e.touches[0]) || e;
      const rect = joy.getBoundingClientRect();
      const x = t.clientX - rect.left, y = t.clientY - rect.top;
      setStick(x, y);
    };
    const end   = ()=>{ dragging = false; resetStick(); };

    stick.addEventListener('touchstart', start, {passive:false});
    stick.addEventListener('touchmove',  move,  {passive:false});
    stick.addEventListener('touchend',   end);
    stick.addEventListener('mousedown',  start);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup',   end);
  }

  Game.Controls = {
    init(camera){
      setupPointerLock(camera);
      setupKeyboard();
      setupJoystick();
    },
    getMoveDelta(camera, dt){
      const forward = new THREE.Vector3();
      const right   = new THREE.Vector3();
      camera.getWorldDirection(forward);
      forward.y = 0; forward.normalize();
      right.crossVectors(forward, new THREE.Vector3(0,1,0)).negate().normalize();

      const input = new THREE.Vector3();
      if (state.keys.up)    input.add(forward);
      if (state.keys.down)  input.addScaledVector(forward, -1);
      if (state.keys.left)  input.addScaledVector(right, -1);
      if (state.keys.right) input.add(right);

      if (input.lengthSq() > 0) input.normalize().multiplyScalar(state.accel*dt);
      state.vel.add(input);
      state.vel.multiplyScalar(state.damping);
      return state.vel.clone().multiplyScalar(dt);
    },
    pointerLocked(){ return state.hasPointerLock; },
    height(){ return state.height; }
  };
})();