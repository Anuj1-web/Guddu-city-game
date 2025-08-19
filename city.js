
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js'

export function buildCity(CONFIG, entitiesRef){
  const g = new THREE.Group()
  const { cityBlocks, blockSize, roadWidth } = CONFIG
  const half = (cityBlocks * (blockSize + roadWidth)) * 0.5

  const roadMat = new THREE.MeshStandardMaterial({ color: 0x1b232b, roughness: 0.92, metalness: 0.0 })
  for(let i=-cityBlocks;i<=cityBlocks;i++){
    const roadX = new THREE.Mesh(new THREE.BoxGeometry( 2*half, 0.02, roadWidth ), roadMat)
    roadX.position.set(0, 0.01, i*(blockSize+roadWidth))
    roadX.receiveShadow = true
    g.add(roadX)
    const roadZ = new THREE.Mesh(new THREE.BoxGeometry( roadWidth, 0.02, 2*half ), roadMat)
    roadZ.position.set(i*(blockSize+roadWidth), 0.01, 0)
    roadZ.receiveShadow = true
    g.add(roadZ)
  }

  const colors = [0x5078a0,0x406080,0x3c5a74,0x5a82aa,0x6b93bb]
  const rand = (a,b)=>a + Math.random()*(b-a)
  for(let x=-cityBlocks; x<cityBlocks; x++){
    for(let z=-cityBlocks; z<cityBlocks; z++){
      const bx = x*(blockSize+roadWidth) + (blockSize*0.5 + rand(-2,2))
      const bz = z*(blockSize+roadWidth) + (blockSize*0.5 + rand(-2,2))
      const h = rand(3, 16)
      const geo = new THREE.BoxGeometry(rand(8, blockSize), h, rand(8, blockSize))
      const mat = new THREE.MeshStandardMaterial({ color: colors[(x*z+colors.length)%colors.length], roughness: 0.6, metalness: 0.2 })
      const b = new THREE.Mesh(geo, mat)
      b.position.set(bx, h*0.5, bz)
      b.castShadow = true
      b.receiveShadow = true
      g.add(b)
      entitiesRef.count++

      const win = new THREE.Mesh(new THREE.BoxGeometry(geo.parameters.width*0.98, h*0.96, geo.parameters.depth*0.98),
        new THREE.MeshBasicMaterial({ color: 0x88b7ff, transparent:true, opacity:0.06 }))
      win.position.copy(b.position)
      g.add(win)
    }
  }
  return g
}
