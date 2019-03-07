<template lang="pug">
div
  #holodeck.navbar-pad(ref='container')
</template>

<script>
/**
 * Setup Three
 * @todo Only load when needed
 */
let $script = document.createElement('script')
$script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/99/three.min.js'
document.body.appendChild($script)

/**
 * Holodeck
 * - Emmits a 'handsfree:onFrame' on the iframe with camera config
 */
export default {  
  data () {
    return {
      // THREE.js
      renderer: null,
      scene: null,
      camera: null,
      ww: 0,
      wh: 0,

      // The scaling of the "screen" in the 3d model
      // - This is the vertical size of screen in 3d-model relative to vertical size of computerscreen in real life
      scaling: 27,

      // x, y, z position of "screen" in 3d-model
      fixedPosition: [0, 0, 50],

      damping: 0.5,

      // vertical size of computer screen (default is 20 cm, i.e. typical laptop size)
      screenHeight: 20
    }
  },

  mounted () {
    const component = this
    
    this.$store.dispatch('onReady', () => {
      const handsfree = window.handsfree
      this.setupThree()
      
      handsfree.use({
        name: 'holodeck',

        // Whether the cursor should be visible (true) or not (false) when over the iframe
        showCursor: false,

        // Used for tweening
        tween: {
          rotationX: 0,
          rotationY: 0,
          rotationZ: 0
        },

        /**
         * Toggle cursor
         */
        onMouseDown () {this.showCursor = !this.showCursor},
        
        /**
         * This is called on each webcam frame
         * @param {Array} poses An array of detected poses
         */
        onFrame (poses) {
          poses.forEach(pose => {
            // Hide cursor when over the iframe
            if (pose.cursor.$target && pose.cursor.$target.nodeName === 'CANVAS') {
              pose.cursor.$el.style.display = this.showCursor ? 'inherit' : 'none'
            } else {
              pose.cursor.$el.style.display = 'inherit'
            }

            // Update positions
            component.updateCamera(pose.face)
            component.renderer.render(component.scene, component.camera)
          })
        }
      })
    })
  },

  methods: {
    /**
     * @see https://www.auduno.com/headtrackr/examples/targets.html
     */
    updateCamera (face) {
      // Use the heads position
      face.translationX = (-face.translationX / window.handsfree.debug.$canvas.width + 0.5) * 20
      face.translationY = (-face.translationY / window.handsfree.debug.$canvas.height + 0.5) * 20
      face.translationZ = (window.handsfree.debug.$canvas.height - face.scale) / 8 + 10

      let xOffset = face.translationX > 0 ? 0 : -face.translationX * 2 * this.damping * this.scaling
      let yOffset = face.translationY < 0 ? 0 : face.translationY * 2 * this.damping * this.scaling
      this.camera.setViewOffset(this.ww + Math.abs(face.translationX * 2 * this.damping * this.scaling), this.wh + Math.abs(face.translationY * this.damping * 2 * this.scaling), xOffset, yOffset, this.ww, this.wh)
      
      this.camera.position.x = this.fixedPosition[0] + (face.translationX * this.scaling * this.damping )
      this.camera.position.y = this.fixedPosition[1] + (face.translationY * this.scaling * this.damping )
      this.camera.position.z = this.fixedPosition[2] + (face.translationZ * this.scaling)
      
      // when changing height of window, we need to change field of view
      this.camera.fov = Math.atan((this.wh / 2 + Math.abs(face.translationY * this.scaling * this.damping )) / (Math.abs(face.translationZ * this.scaling))) *360 / Math.PI
      this.camera.updateProjectionMatrix()
    },
    
    /**
     * @see https://www.auduno.com/headtrackr/examples/targets.html
     */
    setupThree () {
      // Wait for THREE
      if (!window.THREE) {
        setTimeout(() => this.setupThree(), 50)
        return
      }
      
      // Setup
      const container = this.$refs.container
      const THREE = window.THREE
      
      this.scene = new THREE.Scene()
      this.camera = new THREE.PerspectiveCamera(23, window.innerWidth / window.innerHeight, 1, 100000)

      this.scene.fog = new THREE.Fog(0x000000, 1, 5000)
      this.camera.position.z = 6000
      this.scene.add(this.camera)

      this.createWalls()

      // Create targets
      this.createTarget(-150,-150,-550)
      this.createTarget(0,-150,-200)
      this.createTarget(100,0,500)
      this.createTarget(-150,100,0)
      this.createTarget(150,-100,-1050)
      this.createTarget(50,0,1100)
      this.createTarget(-50,-50,600)
      this.createTarget(0,150,-2100)
      this.createTarget(-130,0,-700)      

      // Attach things
      this.renderer = new THREE.WebGLRenderer({clearAlpha: 1})
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      container.appendChild(this.renderer.domElement)

      // Setup Camera
      this.camera.position.x = this.fixedPosition[0]
      this.camera.position.y = this.fixedPosition[1]
      this.camera.position.z = this.fixedPosition[2]
      this.camera.lookAt(new THREE.Vector3(0,0,0))
      
      this.wh = this.screenHeight * this.scaling
      this.ww = this.wh * this.camera.aspect
      
      this.renderer.render(this.scene, this.camera)
    },

    /**
     * Creates the walls
     */
    createWalls () {
      const THREE = window.THREE
      
      //top wall
      const plane1 = new THREE.Mesh( new THREE.PlaneGeometry( 500, 3000, 5, 15 ), new THREE.MeshBasicMaterial( { color: 0xcccccc, wireframe : true } ) )
      plane1.rotation.x = Math.PI/2
      plane1.position.y = 250
      plane1.position.z = 50-1500
      this.scene.add( plane1 )
      
      //left wall
      const plane2 = new THREE.Mesh( new THREE.PlaneGeometry( 3000, 500, 15, 5 ), new THREE.MeshBasicMaterial( { color: 0xcccccc, wireframe : true } ) )
      plane2.rotation.y = Math.PI/2
      plane2.position.x = -250
      plane2.position.z = 50-1500
      this.scene.add( plane2 )
      
      //right wall
      const plane3 = new THREE.Mesh( new THREE.PlaneGeometry( 3000, 500, 15, 5 ), new THREE.MeshBasicMaterial( { color: 0xcccccc, wireframe : true	} ) )
      plane3.rotation.y = -Math.PI/2
      plane3.position.x = 250
      plane3.position.z = 50-1500
      this.scene.add( plane3 )
      
      //bottom wall
      const plane4 = new THREE.Mesh( new THREE.PlaneGeometry( 500, 3000, 5, 15 ), new THREE.MeshBasicMaterial( { color: 0xcccccc, wireframe : true	} ) )
      plane4.rotation.x = -Math.PI/2
      plane4.position.y = -250
      plane4.position.z = 50-1500
      this.scene.add( plane4 )
    },

    /**
     * Adds a target to the THREE scene
     */
    createTarget (x, y, z) {
      const THREE = window.THREE
      
      // Cylinder
      const cylinder = new THREE.Mesh( new THREE.CylinderGeometry(30, 30, 1, 20, 1), new THREE.MeshBasicMaterial( { color : 0xeeeeee} ) )
      cylinder.position.x = x
      cylinder.rotation.x = Math.PI / 2
      cylinder.position.y = y
      cylinder.position.z = z
      this.scene.add( cylinder )
      
      const geometry = new THREE.Geometry()
      geometry.vertices.push( new THREE.Vector3( 0, 0, -80000 ) )
      geometry.vertices.push( new THREE.Vector3( 0, 0, z ) )
      const line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xeeeeee } ) )
      line.position.x = x
      line.position.y = y
      this.scene.add( line )
    }
  }
}
</script>

<style scoped lang="stylus">
>>>#holodeck
  position: fixed
  top: 0
  left: 0
  height: 100%
  width: 100%

  > canvas
    width: 100%
    height: 100%
</style>
