
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js'
export function addSky(scene){
  scene.background = new THREE.Color(0x0a0f14)
  scene.fog = new THREE.Fog(0x0a0f14, 30, 160)
  const hemi = new THREE.HemisphereLight(0xb0d2ff, 0x334455, 0.6)
  scene.add(hemi)
  const sun = new THREE.DirectionalLight(0xffffff, 1.1)
  sun.position.set(20, 40, 20)
  sun.castShadow = true
  sun.shadow.mapSize.set(2048,2048)
  scene.add(sun)
  // Skydome as textured sphere
  const tex = new THREE.TextureLoader().load('./sky.jpg')
  const geo = new THREE.SphereGeometry(500,32,32)
  const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide })
  const dome = new THREE.Mesh(geo, mat)
  scene.add(dome)
}
