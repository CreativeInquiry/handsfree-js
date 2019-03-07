<template lang="pug">
div
  v-container(grid-list-lg flex)
    v-layout(row wrap)
      DocsSidebar(activeGroup='config')
        v-img(src='https://media.giphy.com/media/1BfxclKOXRBVQyX2OV/source.gif')

      v-flex(xs12 md8)
        v-card
          v-card-title(primary-title)
            h2.headline.mb-0 Config Overview
          v-card-text
            p When instantiating <code>Handsfree</code>, you can pass in a config object. The config is saved under <code>handsfree.settings</code>, so to change a setting after instantiation you can use <code>handsfree.settings['my']['setting'] = newValue;</code>:
            pre
              code.javascript.
               const handsfree = new Handsfree({
                  // Hides the cursor when true, or displays it when false
                  hideCursor: false,

                  // Either shows the webcam canvas or not
                  debug: false,
                  
                  settings: {
                    // Maximum number of poses to track
                    maxPoses: 1,

                    sensitivity: {
                      // A factor to adjust the cursors move speed by
                      xy: 0.7,
                      // How much wider (+) or narrower (-) a smile needs to be to click
                      click: 0
                    },
                    
                    stabilizer: {
                      // How much stabilization to use: 0 = none, 3 = heavy
                      factor: 1,
                      // Number of frames to stabilizer over
                      buffer: 30
                    },

                    // Sets up the webcam
                    webcam: {
                      video: {
                        width: 640,
                        height: 480
                      }
                    },

                    // Tracker config
                    tracker: {
                      brf: {
                        // Whether this tracker is enablded on load or not
                        enabled: true
                      },
                      
                      // @see https://github.com/tensorflow/tfjs-models/tree/master/posenet
                      posenet: {
                        // Whether this tracker should be enabled on load or not
                        enabled: false,

                        // @todo Make these comments more succinct
                        // The float multiplier for the depth (number of channels) for all convolution operations.
                        // - The value corresponds to a MobileNet architecture and checkpoint
                        // - The larger the value, the larger the size of the layers, and more accurate the model at the cost of speed
                        // - Set this to a smaller value to increase speed at the cost of accuracy.
                        // - Possible values [0.5, 0.75, 1.0, 1.01]
                        multiplier: 0.5,
                        // A number between 0.2 and 1.0 representing what to scale the image by before feeding it through the network
                        // - Set this number lower to scale down the image and increase the speed when feeding through the network at the cost of accuracy.
                        imageScaleFactor: 0.4,
                        // The minimum overall confidence score required for the a pose/person to be detected.
                        minPoseConfidence: 0.1,
                        // The minimum confidence score for an individual keypoint, like the nose or a shoulder, to be detected.
                        minPartConfidence: 0.5,
                        // the desired stride for the outputs when feeding the image through the model.
                        // - The higher the number, the faster the performance but slower the accuracy
                        // - Possible values [8, 16, 32]
                        outputStride: 32,
                        // Non-maximum suppression part distance
                        // - It needs to be strictly positive
                        // - Two parts suppress each other if they are less than nmsRadius pixels away
                        nmsRadius: 20,
                        // Only return instance detections that have root part score greater or equal to this value.
                        scoreThreshold: 0.5
                      }
                    }
                  }

            v-flex
              v-btn(color='primary' :to='{name: "docsDefaultUsage"}')
                v-icon chevron_left
                | Default Usage
              v-btn(color='primary' :to='{name: "docsPlugins"}' style='float: right')
                | Plugins
                v-icon chevron_right
              .clear
</template>

<script>
import DocsSidebar from './Sidebar'

export default {
  name: 'docsConfig',
  components: {DocsSidebar},
  mounted () {this.$store.dispatch('syntaxHighlight')}
}
</script>