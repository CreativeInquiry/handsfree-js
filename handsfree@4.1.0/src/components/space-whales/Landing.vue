<template lang="pug">
div
  v-container(grid-list-lg @click='isHidden = !isHidden')
    //- Canvas
    canvas(ref='canvas' :class='{"fade-in": !isLoading}')
    Handsfree
    
    //- Title
    v-layout(style='position: relative; z-index: 3')
      v-flex.text-xs-center(xs12 style='margin-top: 100px; text-shadow: 1px 1px 3px rgba(0,0,0,0.35); color: #fff')
        div(v-if='isLoading')
          p
            img(src='/favicon.png' height=128)
          p
            | Whistling in the Space Whales
            v-progress-circular.ml-3(indeterminate color='primary')

        .fade-in(:class='{"faded-out": isLoading || !isHidden}')
          h1.font-weight-bold.mt-0.mb-2.fade-in-delayed Space Whales
          ol(style='width: 400px; margin: auto; text-align: left')
            li.fade-in-delayed The Space Whale will fly towards the direction you're facing
            li.fade-in-delayed Click to toggle this message
            li.fade-in-delayed <strong>This is a work in progress, follow me at <a href="https://twitter.com/labofoz">@labofoz</a></strong>
</template>

<script>
import WebcamToggle from '../WebcamToggle'
import Handsfree from './handsfree'
import {mapState} from 'vuex'
import {debounce} from 'lodash'
const BABYLON = require('babylonjs')
require('babylonjs-loaders')
require('babylonjs-materials')

/**
 * The main landing page
 * @see https://github.com/BrowseHandsfree/handsfreeJS/issues/52
 * 
 * @todo Attributions:
 * - Whale model:  https://sketchfab.com/models/d24d19021c724c3a9134eebcb76b0e0f#download 
 */
export default {
  name: 'HomeLanding',

  components: {
    Handsfree,
    WebcamToggle
  },
  
  computed: mapState([
    'isHandsfreeLoading'
  ]),

  /**
   * Free memory and disable plugins
   */
  beforeRouteLeave (to, from, next) {
    if (this.babylon.engine) {
      this.babylon.engine.stopRenderLoop()
      this.babylon.scene.dispose()
    }
    next()
  },

  data () {
    return {
      // Babylon objects
      babylon: {
        engine: null,
        scene: null,
        light: null
      },

      // Used to set .hidden on the hero text
      isTitleVisible: false,

      // Whether we're loading (true) or not (false)
      isLoading: true,

      // Whether the user has manually hidden the title or not
      isHidden: true
    }
  },

  /**
   * Create the scene
   */
  mounted () {
    this.$store.dispatch('loadScripts', ['https://platform.twitter.com/widgets.js', 'https://buttons.github.io/buttons.js'])
    this.$store.dispatch('syntaxHighlight')
    this.setupScene()
  },

  methods: {
    /**
     * Keep the canvas fullscreen
     */
    resizeCanvas: debounce(function () {
      if (this.babylon.engine) this.babylon.engine.resize()
    }, 100, {leading: true, trailing: true}),

    /**
     * Toggle Webcam
     */
    startWebcam () {this.$store.dispatch('startHandsfree')},
    stopWebcam () {this.$store.dispatch('stopHandsfree')},

    /**
     * Sets up the babylon scene
     */
    setupScene () {
      this.$store.dispatch('onReady', () => {
        const Component = this
        const engine = this.babylon.engine = new BABYLON.Engine(this.$refs.canvas, true)
        const scene = this.babylon.scene = new BABYLON.Scene(engine)

        // Loading screen
        const handsfreeLoadingScreen = function () {
          this.displayLoadingUI = function () {Component.isLoading = true}
          this.hideLoadingUI = function () {Component.isLoading = false}
        }
        engine.loadingScreen = new handsfreeLoadingScreen()

        // Add manta rays
        BABYLON.SceneLoader.ImportMesh(null, '/3d/manta-ray/', 'scene.gltf', scene, meshes => {
          meshes[0].scaling = new BABYLON.Vector3(0.07, 0.07, 0.07)
          meshes[0].position = {x: 8.12, y: -2.71, z: 12.8}
          meshes[0].rotation.y = Math.PI
        })
        BABYLON.SceneLoader.ImportMesh(null, '/3d/manta-ray/', 'scene.gltf', scene, meshes => {
          meshes[0].scaling = new BABYLON.Vector3(0.035, 0.035, 0.035)
          meshes[0].position = {x: -9, y: -0.25, z: 12}
          meshes[0].rotation.y = Math.PI
        })
        BABYLON.SceneLoader.ImportMesh(null, '/3d/manta-ray/', 'scene.gltf', scene, meshes => {
          meshes[0].scaling = new BABYLON.Vector3(0.05, 0.05, 0.05)
          meshes[0].position = {x: -5, y: -1, z: 3}
          meshes[0].rotation.y = Math.PI
        })

        // Add whales
        BABYLON.SceneLoader.ImportMesh(null, '/3d/blue-whale/', 'scene.gltf', scene, meshes => {
          // Create and orient player/whale
          this.$store.commit('set', ['spacewhale.entity.player', meshes[0]])
          this.$store.state.spacewhale.entity.player.rotation.set(new BABYLON.Vector3(100, 0, 0))
          meshes[0].rotationQuaternion = null
          meshes[0].rotation.set(0, 0, 0)

          // Camera
          const camera = this.babylon.camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 0.5, -4), scene)
          this.$store.commit('set', ['spacewhale.camera', camera])
          camera.setTarget(new BABYLON.Vector3(0, 1, 0))
          camera.attachControl(this.$refs.canvas, false)
          scene.clearColor = new BABYLON.Color3(.16078, .10196, .18431)
          this.babylon.light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(-0.25, 0.15, 1), scene)

          // Skybox
          const sky = {
            material: new BABYLON.SkyMaterial('skyMaterial', scene),
            box: BABYLON.Mesh.CreateBox('skyBox', 1000, scene)
          }
          this.$store.commit('set', ['spacewhale.entity.skybox', sky])
          sky.material.backFaceCulling = false
          sky.material.luminance = 0.01
          sky.material.turbidity = 10
          sky.material.inclination = 0.51
          sky.material.azimuth = 0.83
          sky.material.rayleigh = 6
          sky.box.material = sky.material
          
          // Start the render loop
          this.isLoading = false
          setTimeout(() => scene._animationTime = 2500, 0)
          engine.runRenderLoop(() => {scene.render()})
        })

        // Resize
        window.addEventListener('resize', () => this.resizeCanvas())
      })
    }
  }
}
</script>

<style scoped lang="stylus">
// @todo Move these into helper files
>>>.loading-mask
  position: fixed
  z-index: 1
  background: #291a2f
  opacity: 1
  top: 0
  left: 0
  width: 100%
  height: 100%
  transition: opacity 1s ease

  &.fade-out
    pointer-events: none

>>>h1
  color: #fff
  font-size: 72px
  font-weight: 900
  text-align: center
  display: block
  width: 100%
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.35)

>>>canvas
  width: 100%
  height: 100%
  position: fixed
  top: 0
  left: 0
  z-index: 0
  opacity: 0
  transition: opacity 1s ease

.fade-in-delayed
  opacity: 0
  top: -20px

>>>.fade-in
  opacity: 1
  transition: opacity 0.5s ease

  &.faded-out
    opacity: 0

    .fade-in-delayed
      opacity: 0
      top: -20px

  .fade-in-delayed
    opacity: 1
    position: relative
    top: 0px
    transition: opacity 0.75s ease, top 0.75s ease

  for item in 1 2 3 4 5 6 7 8 9
    .fade-in-delayed:nth-child({item})
      transition-delay: 0.045s * item

>>>.fade-out
  opacity: 0
  transition: opacity 1s ease 

@media screen and (max-width: 724px)
  >>>h1
    font-size: 36px
</style>
