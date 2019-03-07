<template lang="pug">
  div
    v-container(grid-list-md)
      v-layout(wrap)
        v-flex(xs12 md6 lg8)
          v-card
            v-card-title
              h2 Settings
            v-card-text
              v-alert(type='warning' value=1 style='color: #444') These settings are a work in progress and don't get saved yet. They work, but will be reset when you refresh the page.
              h3.mt-5 Cursor
              v-layout(row)
                v-flex
                  v-slider(min=0.05 max=1.5 step=0.025 label='Sensitivity' v-model='sensitivity')
                v-flex(shrink style='width: 80px')
                  v-text-field(v-model='sensitivity')
              v-layout(row)
                v-flex
                  v-slider(min=-0.5 max=0.5 step=0.05 label='Smile-Click Sensitivity' v-model='smileClickSensitivity')
                v-flex(shrink style='width: 80px')
                  v-text-field(v-model='smileClickSensitivity')

              h3.mt-5 Stabilizer
              v-layout(row)
                v-flex
                  v-slider(label='Factor' min=0 max=3 step=1 v-model='stabilizerFactor')
                v-flex(shrink style='width: 80px')
                  v-text-field(v-model='stabilizerFactor')
              v-layout(row)
                v-flex
                  v-slider(label='Buffer' min=0 max=100 step=10 v-model='stabilizerBuffer')
                v-flex(shrink style='width: 80px')
                  v-text-field(v-model='stabilizerBuffer')

              h3.mt-5 Multi User
              v-layout(row)
                v-flex
                  v-slider(label='Max Poses (users)' max=20 min=1 step=1 v-model='maxPoses')
                v-flex(shrink style='width: 80px')
                  v-text-field(v-model='maxPoses')

        v-flex(xs12 md6 lg4)
          v-card.mb-2
            v-card-text
              p Click this Stats Panel to view different performance metrics:
              p.statsjs(ref='stats' @click='updateStatsDescription')
              p(v-if='statsMode === 0') <strong>FPS</strong>: Frames rendered in the last second. The higher the number the better.
              p(v-if='statsMode === 1') <strong>MS</strong>: Milliseconds needed to render a frame. The lower the number the better.
              p(v-if='statsMode === 2') <strong>MB</strong>: MBytes of allocated memory
        
          v-card.mb-2
            v-card-title
              h2 Quick Settings
            v-card-text
              v-checkbox(label='Show webcam with debug mask?' v-model='isWebcamVisible')
        
          v-card
            v-card-title
              h2 Models
            v-card-text
              v-checkbox(label='Use head tracking (via BRFv4)?' v-model='useBRF')
              v-checkbox(label='Use full body pose estimation (via PoseNet)?' v-model='usePoseNet')
</template>

<script>
import Stats from 'stats.js'
import {debounce} from 'lodash'

export default {
  name: 'Settings',

  watch: {
    /**
     * Checkboxes
     */
    isWebcamVisible () {
      window.handsfree.debug.isEnabled = this.isWebcamVisible
      window.handsfree.toggleDebugger(this.isWebcamVisible)
    },
    usePoseNet () {window.handsfree.toggleBodyTracker(!this.usePoseNet)},
    useBRF () {window.handsfree.toggleFaceTracker(!this.useBRF)},

    /**
     * Set the number of faces
     */
    maxPoses: debounce(function (maxPoses) {
      window.handsfree.settings.maxPoses = maxPoses
      window.handsfree.brf.manager.setmaxPosesToTrack && window.handsfree.brf.manager.setmaxPosesToTrack(maxPoses)
    }, 500),

    /**
     * Adjust sensitivity
     */
    sensitivity: debounce(function (sensitivity) {window.handsfree.settings.sensitivity.xy = sensitivity}),
    smileClickSensitivity: debounce(function (sensitivity) {window.handsfree.settings.sensitivity.click = sensitivity}),

    /**
     * Adjust Stabilizer
     */
    stabilizerFactor: debounce(function (factor) {window.handsfree.settings.stabilizer.factor = factor}),
    stabilizerBuffer: debounce(function (buffer) {window.handsfree.settings.stabilizer.buffer = buffer})
  },
  
  data () {
    return {
      maxPoses: 1,

      // BRFv4
      smileClickSensitivity: 0,
      statsMode: 0,
      sensitivity: 0.7,
      stabilizerFactor: 1,
      stabilizerBuffer: 30,
      isWebcamVisible: false,

      // Models
      usePoseNet: false,
      useBRF: false
    }
  },

  /**
   * Add stats
   */
  mounted () {
    const stats = new Stats()
    const perf = function () {
      stats.end()
      requestAnimationFrame(perf)
      stats.begin()
    }
    stats.showPanel(0)
    this.$refs.stats.appendChild(stats.dom)
    perf()

    this.syncSettings()

    this.$store.dispatch('onReady', () => {
      this.usePoseNet = window.handsfree.settings.tracker.posenet.enabled
      this.useBRF = window.handsfree.settings.tracker.brf.enabled
      this.isWebcamVisible = window.handsfree.debug.isEnabled
    })
  },

  methods: {
    /**
     * Update the stats description
     */
    updateStatsDescription () {
      this.statsMode++
      if (this.statsMode > 2) this.statsMode = 0
    },

    /**
     * Syncs settings with handsfree.js
     */
    syncSettings () {
      if (window.handsfree) {
        const settings = window.handsfree.settings
  
        this.maxPoses = settings.maxPoses
        this.smileClickSensitivity = settings.sensitivity.click
        this.sensitivity = settings.sensitivity.xy
        this.stabilizerFactor = settings.stabilizer.factor
        this.stabilizerBuffer = settings.stabilizer.buffer
      } else {
        setTimeout(() => {this.syncSettings()}, 50)
      }
    }
  }
}
</script>

<style lang="stylus">
.statsjs > div
  position: relative !important
  z-index: 1 !important

  canvas
    width: 100% !important
    height: initial !important
</style>
