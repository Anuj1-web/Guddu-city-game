
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js'

let keys = {}
export let isPaused = false

export function makePlayer(){
  const group = new THREE.Group()
  const geo = new THREE.CapsuleGeometry(0.35, 1.1, 6, 12)
  const mat = new THREE.MeshStandardMaterial({ color: 0xfff0cc, roughness: 0.6 })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.castShadow = true
  group.add(mesh)
  group.position.set(0, 1, 6)

  const camPivot = new THREE.Object3D()
  camPivot.position.set(0, 1.2, 0)
  group.add(camPivot)

  window.addEventListener('keydown', e=>keys[e.code]=true)
  window.addEventListener('keyup', e=>keys[e.code]=false)

  return { group, mesh, camPivot, vel:new THREE.Vector3(), yaw:0 }
}

export function updatePlayer(p, camera, CONFIG, dt){
  const speed = CONFIG.walkSpeed * (keys['ShiftLeft']||keys['ShiftRight'] ? CONFIG.runMultiplier : 1)
  const forward = (keys['KeyW']||keys['ArrowUp']) ? 1 : (keys['KeyS']||keys['ArrowDown']) ? -1 : 0
  const strafe  = (keys['KeyD']||keys['ArrowRight']) ? 1 : (keys['KeyA']||keys['ArrowLeft']) ? -1 : 0

  const camDir = new THREE.Vector3()
  camera.getWorldDirection(camDir)
  const targetYaw = Math.atan2(camDir.x, camDir.z)
  p.yaw = THREE.MathUtils.lerpAngle(p.yaw, targetYaw, 0.1)
  p.group.rotation.y = p.yaw

  const dir = new THREE.Vector3(strafe, 0, -forward).applyAxisAngle(new THREE.Vector3(0,1,0), targetYaw)
  p.vel.lerp(dir.multiplyScalar(speed), 0.15)
  p.group.position.addScaledVector(p.vel, dt)
  p.group.position.y = 1

  const behind = new THREE.Vector3(0, 2.2, 4.5).applyAxisAngle(new THREE.Vector3(0,1,0), targetYaw)
  camera.position.copy(p.group.position).add(behind)
  camera.lookAt(p.group.position.x, p.group.position.y+0.8, p.group.position.z)
}
