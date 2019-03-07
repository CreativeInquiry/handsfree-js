const {throttle} = require('lodash')

module.exports = Handsfree => {
  /**
   * Draws poses
   */
  Handsfree.prototype.debugPoses = function () {
    this.pose[0].face && !this.tracker.brf._isDisabled && this.drawFaces()
    this.pose[0].body && !this.tracker.posenet._isDisabled && this.debugPoseNetPoses()
  }

  /**
   * Resizes the canvas to match video
   */
  Handsfree.prototype.resizeCanvas = throttle(function () {
    if (this.debug.$webcam.videoWidth === 0) {
      this.resizeCanvas()
    } else {
      this.debug.$canvas.width = this.debug.$webcam.videoWidth
      this.debug.$canvas.height = this.debug.$webcam.videoHeight
    }
  }, 50)
  
  /**
   * Inject the debugger, which includes a video, canvas, and wrapping div
   * @emits handsfree-injectDebugger
   */
  Handsfree.prototype.injectDebugger = function () {
    let $webcam
    let $canvas
    let $wrap
    let $parent

    // Create debug elements
    this.debug.$wrap = $wrap = document.createElement('div')
    this.debug.$webcam = $webcam = document.createElement('video')
    this.debug.$canvas = $canvas = document.createElement('canvas')

    $webcam.width = this.settings.webcam.video.width
    $webcam.height = this.settings.webcam.video.height

    $wrap.classList.add('handsfree-debugger')
    $webcam.classList.add('handsfree-webcam')
    $canvas.classList.add('handsfree-canvas')

    // Apply minimal styles
    // @TODO let's apply this via stylsheet @see https://github.com/BrowseHandsfree/handsfreeJS/issues/17
    $webcam.setAttribute('playsinline', 'playsinline')
    $wrap.style.display = 'none'
    $wrap.style.position = 'relative'
    $webcam.style.transform = 'scale(-1, 1)'
    $canvas.style.transform = 'scale(-1, 1)'
    $canvas.style.position = 'absolute'
    $canvas.style.top = '0px'
    $canvas.style.left = '0%'
    $canvas.style.width = '100%'
    $canvas.style.height = 'inherit'

    // Inject
    $parent = document.querySelector('.handsfree-debug-wrap')
    if (!$parent) $parent = document.body

    $parent.appendChild($wrap)
    $wrap.appendChild($webcam)
    $wrap.appendChild($canvas)

    /**
     * Dispatch global event
     * @todo update this to handsfree:injectDebugger @see https://github.com/BrowseHandsfree/handsfreeJS/issues/47
     */
    this.debug.ctx = $canvas.getContext('2d')
    window.dispatchEvent(new CustomEvent('handsfree-injectDebugger', {detail: {
      scope: this,
      canvasContext: this.debug.ctx
    }}))
  }
  
  /**
   * Toggle Debugger
   * @param {Boolean|Null} state Whether to turn it on (true), off (false), or flip between the two (null)
   */
  Handsfree.prototype.toggleDebugger = function (state = null) {
    if (typeof state === 'boolean') this.debug.isDebugging = state
    else this.debug.isDebugging = !this.debug.isDebugging

    this.debug.$wrap.style.display = this.debug.isDebugging ? 'inline-block' : 'none'
  }
}
