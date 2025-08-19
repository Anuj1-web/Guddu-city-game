
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js'
export function buildGround(){
  const tex = new THREE.TextureLoader().load('./ground.jpg')
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(20,20)
  const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95, metalness: 0.0 })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1000,1000), mat)
  mesh.rotation.x = -Math.PI/2
  mesh.receiveShadow = true
  return mesh
}
export function buildCityBlocks(CONFIG, entitiesRef){
  const g = new THREE.Group()
  const colors=[0x5078a0,0x406080,0x3c5a74,0x5a82aa,0x6b93bb]
  const rand=(a,b)=>a+Math.random()*(b-a)
  for(let i=0;i<120;i++){
    const w=rand(6,18), d=rand(6,18), h=rand(8,28)
    const geo = new THREE.BoxGeometry(w,h,d)
    const mat = new THREE.MeshStandardMaterial({ color: colors[i%colors.length], roughness: 0.55, metalness: 0.25 })
    const m = new THREE.Mesh(geo, mat)
    m.position.set(rand(-200,200), h*0.5, rand(-200,200))
    m.castShadow = true; m.receiveShadow = true
    g.add(m); entitiesRef.count++
    // windows glow shell
    const win = new THREE.Mesh(new THREE.BoxGeometry(w*0.98, h*0.96, d*0.98), new THREE.MeshBasicMaterial({color:0x88b7ff,transparent:true,opacity:0.07}))
    win.position.copy(m.position); g.add(win)
  }
  return g
}
export function addBillboards(g){
  const tex = new THREE.TextureLoader().load('./hoarding.png')
  for(let i=0;i<6;i++){
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(12,7), new THREE.MeshStandardMaterial({map:tex,roughness:0.7, metalness:0.1}))
    mesh.position.set(-60 + i*24, 4, -80)
    mesh.castShadow=true; mesh.receiveShadow=true
    g.add(mesh)
  }
}
export function addTrees(g){
  const tex = new THREE.TextureLoader().load('./tree.png')
  for(let i=0;i<40;i++){
    const m = new THREE.Mesh(new THREE.PlaneGeometry(6,6), new THREE.MeshBasicMaterial({map:tex, transparent:true}))
    m.position.set((Math.random()-0.5)*380, 3, (Math.random()-0.5)*380)
    m.castShadow=false; m.receiveShadow=false
    g.add(m)
  }
}
export function addGiftsAndCandies(g){
  const giftTex = new THREE.TextureLoader().load('./gift.png')
  const candyTex = new THREE.TextureLoader().load('./candy.png')
  for(let i=0;i<12;i++){
    const isGift = Math.random()>0.5
    const tex = isGift ? giftTex : candyTex
    const s = isGift ? 2.2 : 1.6
    const m = new THREE.Mesh(new THREE.PlaneGeometry(s,s), new THREE.MeshBasicMaterial({map:tex, transparent:true}))
    m.position.set((Math.random()-0.5)*160, s*0.5, (Math.random()-0.5)*160)
    m.userData = { type: isGift ? 'gift' : 'candy' }
    g.add(m)
  }
}
