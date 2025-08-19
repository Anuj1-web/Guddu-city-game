
export function makeIntro(onStart){
  const intro = document.createElement('div')
  intro.id = 'intro'
  intro.innerHTML = `
    <div class="card">
      <h1 class="h1">Guddu City — Three.js</h1>
      <p class="sub">Unity-like feel · Mobile friendly · HD visuals · Tap Start</p>
      <button class="btn" id="startBtn">▶ Start Game</button>
    </div>`
  document.body.appendChild(intro)
  intro.querySelector('#startBtn').addEventListener('click', ()=>{ intro.remove(); onStart?.() })
}
export function makeHUD(){
  const hud = document.getElementById('hud')
  const badge = document.createElement('div')
  badge.className='badge'; badge.textContent='Guddu City · v1.0 Flat'
  const stats = document.createElement('div')
  stats.className='stats'; stats.id='stats'; stats.textContent='FPS: -- | Entities: --'
  hud.append(badge, stats)
}
export function setStatsText(s){ const el=document.getElementById('stats'); if(el) el.textContent = s }
