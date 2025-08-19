
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/UnrealBloomPass.js'
import { SSAOPass } from 'https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/SSAOPass.js'

import { buildCity } from './city.js'
import { makePlayer, updatePlayer, isPaused } from './player.js'
import { makeTraffic, updateTraffic } from './traffic.js'
import { makeSparkles } from './particles.js'
import { addSky } from './sky.js'
import { setupAudio } from './audio.js'
import { makeIntro, makeHUD, setStatsText, makePause, togglePause } from './ui.js'

const CONFIG = {
  cityBlocks: 8,
  blockSize: 22,
  roadWidth: 6,
  carCount: 40,
  personHeight: 1.75,
  walkSpeed: 2.4,
  runMultiplier: 1.8,
  fov: 65,
  bloomStrength: 0.7,
  shadows: true,
}

let renderer, scene, camera, composer, clock, controls
let entities = {count:0}

const app = document.getElementById('app')
makeIntro(init)

function init(){
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0b0f14)

  renderer = new THREE.WebGLRenderer({ antialias:true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.04
  renderer.shadowMap.enabled = CONFIG.shadows
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  app.appendChild(renderer.domElement)

  camera = new THREE.PerspectiveCamera(CONFIG.fov, window.innerWidth/window.innerHeight, 0.1, 500)
  camera.position.set(10,6,12)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.enablePan = false
  controls.maxPolarAngle = Math.PI*0.49
  controls.target.set(0,1.2,0)

  addSky(scene)

  const sun = new THREE.DirectionalLight(0xffffff,1.0)
  sun.position.set(20,40,20)
  sun.castShadow = CONFIG.shadows
  sun.shadow.mapSize.set(2048,2048)
  scene.add(sun)

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(800,800), new THREE.MeshStandardMaterial({color:0x2a3a4a,roughness:0.95}))
  ground.rotation.x = -Math.PI/2
  ground.receiveShadow = true
  scene.add(ground)

  scene.add(buildCity(CONFIG, entities))
  const player = makePlayer()
  scene.add(player.group)
  const traffic = makeTraffic(CONFIG, entities)
  scene.add(traffic)
  scene.add(makeSparkles())

  composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), CONFIG.bloomStrength,0.9,0.85))
  composer.addPass(new SSAOPass(scene,camera,window.innerWidth,window.innerHeight))

  setupAudio(camera)

  makeHUD()
  makePause()

  window.addEventListener('resize', ()=>{
    camera.aspect = window.innerWidth/window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    composer.setSize(window.innerWidth, window.innerHeight)
  })
  window.addEventListener('keydown', e=>{
    if(e.code==='Escape'){ togglePause(!isPaused) }
  })

  clock = new THREE.Clock()
  animate()
  function animate(){
    requestAnimationFrame(animate)
    const dt = Math.min(clock.getDelta(),0.033)
    if(!isPaused){
      updatePlayer(player,camera,CONFIG,dt)
      updateTraffic(traffic,CONFIG,dt)
      controls.update()
    }
    setStatsText(`FPS:${Math.round(1/dt)} | Entities:${entities.count}`)
    composer.render()
  }
}
