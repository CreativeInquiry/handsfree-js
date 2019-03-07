<template lang="pug">
div
  v-container(grid-list-lg flex)
    v-layout(row wrap)
      DocsSidebar
        v-img(src='https://media.giphy.com/media/1BfxclKOXRBVQyX2OV/source.gif')

      v-flex(xs12 md8)
        v-card
          v-card-title(primary-title)
            h2.headline.mb-0 Plugins
          v-card-text
            p Handsfree.js is built around plugins. Plugins have several callbacks that hook into different events, and are added with <code>handsfree.use(config)</code>.
            p Each callback receives two arguments, <code>(poses, instance)</code>. <code>instance</code> refers to the <code>new Handsfree</code> instance you created. <code>poses</code> is an array of objects containing the following:
            pre
              code.javascript.
                {
                  cursor: {
                    // Where on the screen the user is pointed at
                    x: 0,
                    y: 0,
                    
                    // The target currently under the mouse
                    $target: 0,
                    
                    // Mouse states for this face
                    state: {
                      // The first frame of a click
                      mouseDown: false,
                      // Every subsequent frame of a click
                      mouseDrag: false,
                      // When the click is finally released
                      mouseUp: false
                    }
                  },

                  /**
                    * A BRFv4 tracked face
                    * @see https://tastenkunst.github.io/brfv4_docs/#hl_BRFFace
                    */
                  face: {
                    
                    // A list of all 64 landmarks
                    points: [{x, y}, ...],
                  
                    // The head's pitch (facing up/down)
                    rotationX: 0,
                    // The head's yaw (facing left/right)
                    rotationY: 0,
                    // The head's roll (as if doing a cartwheel while facing straight ahead)
                    rotationZ: 0,
                  
                    // The heads overall size within the camera
                    scale: 0,
                  
                    // Where the head is relative to the left edge of the video feed
                    translationX: 0,
                    // Where the head is relative to the top edge of the video feed
                    translationY: 0
                  },

                  /**
                   * PoseNet tracked full body pose estimation
                   * @see https://github.com/tensorflow/tfjs-models/tree/master/posenet
                   */
                  body: {
                    // A confidence score between 0-1 representing the overall pose confidence,
                    // representing how sure the model is that a pose is there
                    score: 1.0,

                    keypoints: [
                      // Represents one keypoint
                      {
                        // Other values include:
                        // leftEye, leftEar, leftShoulder, leftWrist, leftHip, leftKnee, leftAnkle...rightAnkle
                        part: 'nose',

                        // A confidence score between 0 and 1
                        // representing how sure the model thinks the keypoint is there
                        score: 1.0,

                        // The position relative to the top/left of the video stream
                        // Max values are (handsfree.debug.$canvas.width, handsfree.debug.$canvas.height)
                        position: {x: 0, y: 0}
                      }
                    ]
                  }
                }
                
            p Here are the landmark points, with #27 being the reference point for rotation/translation:
            p
              img(src='../../assets/img/brfv4_landmarks.jpg')

            p The following are the available plugin methods:
            pre
              code.javascript.
                const myPlugin = handsfree.use({
                  // Must be unique. Spaces and special characters are fine
                  name: '',

                  // The plugins execution priority
                  // - Lower numbers run before higher numbers
                  // - Numbers can be negative and fractional
                  priority: 10,

                  // Set to true to have this plugin disabled by default
                  _isDisabled: false,

                  // Called once when the use method is called and after the plugin is added to the instance
                  onUse: () => {},

                  // Called once per frame, after calculations, along with the detected pose object
                  // - {Return}       To overwrite/modify the properties of handsfree.pose for use within other plugins, return an array with modifications
                  onFrame: (poses, handsfree) => {},

                  // Called any time Handsfree.start() is called
                  onStart: (handsfree) => {},

                  // Called any time Handsfree.stop() is called
                  onStop: (handsfree) => {},

                  // Called when .disable() is explicitely called on this plugin
                  onDisable: (handsfree) => {},

                  // Called when .enable() is explicitely called on this plugin
                  onEnable: (handsfree) => {},

                  // Called the first frame a pose clicks
                  onMouseDown: (pose, poseIndex) => {},

                  // Called every frame after a pose clicks and is still in "click mode"
                  onMouseDrag: (pose, poseIndex) => {},

                  // Called after a pose releases a click
                  onMouseUp: (pose, poseIndex) => {}
                })

            p Additionally, every plugin has a <code>.disable()</code> and an <code>.enable()</code> method, which sets a <code>._isDisabled</code> flag to either true or false:
            pre
              code.javascript.
                handsfree.plugin['my-plugin'].disable() // handsfree.plugin['my-plugin']._isDisabled === true
                handsfree.plugin['my-plugin'].enable() // handsfree.plugin['my-plugin']._isDisabled === false

            v-flex
              v-btn(color='primary' :to='{name: "docsConfig"}')
                v-icon chevron_left
                | Config &amp; Settings
              v-btn(color='primary' :to='{name: "docsEvents"}' style='float: right')
                | Events
                v-icon chevron_right
              .clear
</template>

<script>
import DocsSidebar from './Sidebar'

export default {
  name: 'docsPlugins',
  components: {DocsSidebar},
  mounted () {this.$store.dispatch('syntaxHighlight')}
}
</script>
