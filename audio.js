
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js'

export function setupAudio(camera){
  const listener = new THREE.AudioListener()
  camera.add(listener)
  const ambient = new THREE.Audio(listener)
  const loader = new THREE.AudioLoader()
  loader.load('./assets/audio/ambient.wav', buffer=>{
    ambient.setBuffer(buffer)
    ambient.setLoop(true)
    ambient.setVolume(0.25)
    ambient.play()
  })
}
