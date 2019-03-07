const HandsfreePose = window.HandsfreePose = require('../Pose')
const {once} = require('lodash')

module.exports = Handsfree => {
  Handsfree.prototype.init = function () {
    // Inject elements
    this.injectDebugger()
    this.reservePoses()

    // Init trackers
    this.settings.tracker.brf.enabled && this.initBRF()
    this.settings.tracker.posenet.enabled && this.initPoseNet()
  }

  /**
   * Notifies the document that handsfree is ready
   * - Adds a body class
   * - useful for enabling .start() buttons
   */
  Handsfree.prototype.onReadyHook = once(function () {
    window.dispatchEvent(new CustomEvent('handsfree:ready'))
    document.body.classList.remove('handsfree-is-loading')
    document.body.classList.add('handsfree-ready')
  })

  /**
   * Deletes all poses and creates a HandsfreePose object for .settings.maxPoses
   * - Also sets handsfree.cursor.$el
   */
  Handsfree.prototype.reservePoses = function () {
    this.pose = []
    for (let i = 0; i < this.settings.maxPoses; i++) {
      this.pose.push(new HandsfreePose())
    }
    this.cursor.$el = this.pose[0].$el
  }
}
