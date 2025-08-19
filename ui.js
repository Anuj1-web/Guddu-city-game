
export function makeIntro(onStart){
  const intro = document.createElement('div')
  intro.id = 'intro'
  intro.innerHTML = `
    <div class="card">
      <h1 class="h1">Guddu City · Three.js</h1>
      <p class="sub">A smooth, Unity-like mini city with realistic lights, shadows, bloom and ambient life.</p>
      <div class="row" style="margin-bottom:16px">
        <div class="kv">🎮 <b>WASD</b> move</div>
        <div class="kv">🖱️ <b>Drag</b> orbit</div>
        <div class="kv">⇧ <b>Hold</b> run</div>
        <div class="kv">E <b>Interact</b></div>
      </div>
      <button class="btn" id="startBtn">▶ Start Game</button>
    </div>`
  document.body.appendChild(intro)
  intro.querySelector('#startBtn').addEventListener('click', ()=>{
    intro.remove()
    onStart?.()
  })
}

export function makeHUD(){
  const hud = document.createElement('div')
  hud.id = 'hud'
  const badge = document.createElement('div')
  badge.className = 'badge'
  badge.textContent = 'Guddu City · v1.0 — Three.js'
  const stats = document.createElement('div')
  stats.className = 'stats'
  stats.id = 'stats'
  stats.textContent = 'FPS: -- | Entities: --'
  hud.append(badge, stats)
  document.body.appendChild(hud)
}

export function setStatsText(text){
  const el = document.getElementById('stats')
  if(el) el.textContent = text
}

export function makePause(){
  const pause = document.createElement('div')
  pause.className = 'pause'
  pause.id = 'pause'
  pause.innerHTML = '<div class="inner"><h3>Paused</h3><p>Press <b>Esc</b> to resume.</p></div>'
  document.body.appendChild(pause)
  return pause
}

export function togglePause(show){
  const el = document.getElementById('pause')
  if(el) el.style.display = show ? 'flex' : 'none'
}

export function makeHotspot(x=0,y=0,text=''){
  const hs = document.createElement('div')
  hs.className = 'hotspot'
  hs.textContent = text
  hs.style.left = x+'px'
  hs.style.top = y+'px'
  document.body.appendChild(hs)
  return hs
}
