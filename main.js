
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js'
import { EffectComposer } from 'https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/UnrealBloomPass.js'
import { SSAOPass } from 'https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/SSAOPass.js'

import { addSky } from './sky.js'
import { buildGround, buildCityBlocks, addBillboards, addTrees, addGiftsAndCandies } from './city.js'
import { makeSparkles } from './particles.js'
import { makeIntro, makeHUD, setStatsText } from './utils.js'
import { makeTraffic, updateTraffic } from './traffic.js'
import { attachTouchControls } from './controls.js'
import { spinHoardings } from './hoardings.js'

const CONFIG = { fov:65, bloomStrength:0.75, shadows:true }

let renderer, scene, camera, composer, clock
let entities = {count:0}
let hoardingGroup, trafficGroup

makeIntro(init)

function init(){
  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias:true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.shadowMap.enabled = CONFIG.shadows
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  document.getElementById('app').appendChild(renderer.domElement)

  // Scene & Camera
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(CONFIG.fov, window.innerWidth/window.innerHeight, 0.1, 1000)
  camera.position.set(12, 8, 14)
  scene.add(camera)

  // World
  addSky(scene)
  scene.add(buildGround())
  const city = buildCityBlocks(CONFIG, entities); scene.add(city)
  addTrees(scene)
  addGiftsAndCandies(scene)

  // Hoardings row
  hoardingGroup = new THREE.Group(); addBillboards(hoardingGroup); scene.add(hoardingGroup)

  // Particles
  scene.add(makeSparkles())

  // Traffic
  trafficGroup = makeTraffic(entities); scene.add(trafficGroup)

  // Post FX
  composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), CONFIG.bloomStrength,0.9,0.85))
  composer.addPass(new SSAOPass(scene,camera,window.innerWidth,window.innerHeight))

  // UI
  makeHUD()

  // Events
  window.addEventListener('resize', onResize)
  renderer.domElement.addEventListener('wheel', (e)=>{
    e.preventDefault()
    const d = Math.sign(e.deltaY)
    camera.position.multiplyScalar(1 + d*0.05)
  }, {passive:false})

  // Mobile touch controls
  attachTouchControls(renderer.domElement, camera)

  clock = new THREE.Clock()
  animate()
}

function onResize(){
  camera.aspect = window.innerWidth/window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  composer.setSize(window.innerWidth, window.innerHeight)
}

function animate(){
  requestAnimationFrame(animate)
  const dt = Math.min(clock.getDelta(), 0.033)
  updateTraffic(trafficGroup, dt)
  spinHoardings(hoardingGroup, dt)
  setStatsText(`FPS: ${Math.round(1/dt)} | Entities: ${entities.count}`)
  composer.render()
}
