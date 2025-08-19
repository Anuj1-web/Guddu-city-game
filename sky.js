
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js'

export function addSky(scene){
  // Use hemisphere light and fog for sky atmosphere
  const hemi = new THREE.HemisphereLight(0xb0d2ff, 0x334455, 0.5)
  scene.add(hemi)
  scene.fog = new THREE.Fog(0x0b0f14, 30, 160)
}
