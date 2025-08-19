
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js'

export function makeTraffic(CONFIG, entitiesRef){
  const g = new THREE.Group()
  const carGeo = new THREE.BoxGeometry(1.2, 0.5, 2.2)
  const carMat = new THREE.MeshStandardMaterial({ color: 0xffaa33, roughness: 0.4, metalness: 0.3 })
  const laneSize = CONFIG.blockSize + CONFIG.roadWidth
  const count = CONFIG.carCount
  const cars = []
  for(let i=0;i<count;i++){
    const m = new THREE.Mesh(carGeo, carMat.clone())
    m.material.color.offsetHSL(Math.random()*0.7-0.35, 0.2, 0.1)
    m.castShadow = true; m.receiveShadow = true
    const horizontal = Math.random() > 0.5
    const lane = (Math.random()*6|0) - 3
    const sign = Math.random()>0.5?1:-1
    m.userData = { horizontal, lane, t: Math.random()*100, speed: 5+Math.random()*4, sign }
    if(m.userData.horizontal){
      m.position.set(-laneSize*CONFIG.cityBlocks*0.5, 0.26, m.userData.lane*laneSize)
    }else{
      m.position.set(m.userData.lane*laneSize, 0.26, -laneSize*CONFIG.cityBlocks*0.5)
      m.rotation.y = Math.PI/2
    }
    g.add(m)
    cars.push(m)
    entitiesRef.count++
  }
  g.userData.cars = cars
  return g
}

export function updateTraffic(group, CONFIG, dt){
  const cars = group.userData.cars
  const laneSize = CONFIG.blockSize + CONFIG.roadWidth
  const L = CONFIG.cityBlocks*(laneSize)
  for(const m of cars){
    const u = m.userData
    const dist = u.speed * dt * u.sign
    if(u.horizontal){
      m.position.x += dist
      if(m.position.x > L*0.5) m.position.x = -L*0.5
      if(m.position.x < -L*0.5) m.position.x = L*0.5
    }else{
      m.position.z += dist
      if(m.position.z > L*0.5) m.position.z = -L*0.5
      if(m.position.z < -L*0.5) m.position.z = L*0.5
    }
  }
}
