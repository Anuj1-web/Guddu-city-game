
let touch0 = null, dist0 = 0
export function attachTouchControls(canvas, camera){
  canvas.addEventListener('touchstart', (e)=>{
    if(e.touches.length===1){ touch0 = {x:e.touches[0].clientX, y:e.touches[0].clientY} }
    if(e.touches.length===2){
      const [a,b] = e.touches
      dist0 = Math.hypot(a.clientX-b.clientX, a.clientY-b.clientY)
    }
  }, {passive:true})
  canvas.addEventListener('touchmove', (e)=>{
    if(e.touches.length===1 && touch0){
      const dx = e.touches[0].clientX - touch0.x
      const dy = e.touches[0].clientY - touch0.y
      camera.rotation.y -= dx * 0.002
      camera.rotation.x -= dy * 0.002
      touch0 = {x:e.touches[0].clientX, y:e.touches[0].clientY}
    }
    if(e.touches.length===2){
      const [a,b] = e.touches
      const d = Math.hypot(a.clientX-b.clientX, a.clientY-b.clientY)
      const delta = d - dist0
      camera.position.multiplyScalar(1 - delta*0.001)
      dist0 = d
    }
  }, {passive:true})
  canvas.addEventListener('touchend', ()=>{ touch0=null }, {passive:true})
}
