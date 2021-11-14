<template>
  <div id="container"></div>
</template>
<script>
import * as THREE from 'three'
import { OrbitControls } from './OrbitControls.js'
import { Water } from './Water.js'
import { Sky } from './Sky.js'
export default {
  name: 'three',
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      container: null,
      controls: null,
      sky: null,
      water: null,
      sun: null,
      controls: null,
      parameters: null,
      pmremGenerator: null,
    }
  },
  methods: {
    init() {
      this.container = document.getElementById('container')

      //

      this.renderer = new THREE.WebGLRenderer()
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping
      this.container.appendChild(this.renderer.domElement)

      //

      this.scene = new THREE.Scene()

      this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000)
      this.camera.position.set(30, 30, 100)

      //

      this.sun = new THREE.Vector3()

      // Water

      const waterGeometry = new THREE.PlaneGeometry(10000, 10000)

      this.water = new Water(waterGeometry, {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load('static/img/waternormals.jpg', function (texture) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        }),
        sunDirection: new THREE.Vector3(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7,
        fog: this.scene.fog !== undefined,
      })

      this.water.rotation.x = -Math.PI / 2

      this.scene.add(this.water)

      // Skybox

      this.sky = new Sky()
      this.sky.scale.setScalar(10000)
      this.scene.add(this.sky)

      const skyUniforms = this.sky.material.uniforms

      skyUniforms['turbidity'].value = 10
      skyUniforms['rayleigh'].value = 2
      skyUniforms['mieCoefficient'].value = 0.005
      skyUniforms['mieDirectionalG'].value = 0.8

      this.parameters = {
        elevation: 2,
        azimuth: 180,
      }

      this.pmremGenerator = new THREE.PMREMGenerator(this.renderer)

      this.updateSun()

      //

      // const geometry = new THREE.BoxGeometry(0, 0, 0)
      // const material = new THREE.MeshStandardMaterial({ roughness: 0 })

      // this.mesh = new THREE.Mesh(geometry, material)
      // this.scene.add(this.mesh)

      //

      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.controls.maxPolarAngle = Math.PI * 0.495
      this.controls.target.set(0, 10, 0)
      this.controls.minDistance = 40.0
      this.controls.maxDistance = 200.0
      this.controls.update()

      window.addEventListener('resize', this.onWindowResize)
    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()

      this.renderer.setSize(window.innerWidth, window.innerHeight)
    },
    updateSun() {
      const phi = THREE.MathUtils.degToRad(90 - this.parameters.elevation)
      const theta = THREE.MathUtils.degToRad(this.parameters.azimuth)

      this.sun.setFromSphericalCoords(1, phi, theta)

      this.sky.material.uniforms['sunPosition'].value.copy(this.sun)
      this.water.material.uniforms['sunDirection'].value.copy(this.sun).normalize()

      this.scene.environment = this.pmremGenerator.fromScene(this.sky).texture
    },
    animate() {
      requestAnimationFrame(this.animate)
      this.render()
    },

    render() {
      const time = performance.now() * 0.001

      // this.mesh.position.y = Math.sin(time) * 20 + 5
      // this.mesh.rotation.x = time * 0.5
      // this.mesh.rotation.z = time * 0.51
      this.water.material.uniforms['time'].value += 1.0 / 60.0

      this.renderer.render(this.scene, this.camera)
    },
  },
  mounted() {
    this.init()
    this.animate()
  },
}
</script>
<style lang="css" scoped>
#container {
  width: 100%;
  height: 100%;
}
</style>