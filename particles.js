
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js'

export function makeSparkles(){
  const count = 1500
  const pos = new Float32Array(count*3)
  for(let i=0;i<count;i++){
    const r = 30*Math.random()+6
    const a = Math.random()*Math.PI*2
    const h = Math.random()*6 + 3
    pos[i*3+0] = Math.cos(a)*r
    pos[i*3+1] = h
    pos[i*3+2] = Math.sin(a)*r
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos,3))
  const mat = new THREE.PointsMaterial({ size: 0.05, color: 0x88ccff, transparent:true, opacity:0.9 })
  return new THREE.Points(geo, mat)
}
