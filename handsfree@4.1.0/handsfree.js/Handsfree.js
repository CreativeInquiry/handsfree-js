/**
 *                       ✨
 *                        (\.   \      ,/)
 *                         \(   |\     )/
 *                         //\  | \   /\\
 *                       (/ /\_#👓#_/\ \)
 *                         \/\  ####  /\/
 *                             `##'
 * 
 *                      🔮 /Handsfree.js 🔮
 * 
 * @description Use computer vision to handsfree-ify websites, apps, games,
 * tools, robotics and anything else with a webcam just...like...✨...that!
 * 
 * # NOTES
 * - via Node: This is what you get when you require('handsfree')
 * -- eg: const Handsfree = require('handsfree')
 *        const handsfree = new Handsfree(opts)
 * 
 * - via <script>: This class is exposed via a global Handsfree module object
 * -- eg: <script src="https://unpkg.com/handsfree/@<4/dist/handsfree.js"></script>
 *        <script>const handsfree = new Handsfree(opts)</scrtip>
 * 
 * - **Caps matter**
 * -- Handsfree with capital H refers to the class
 * -- We use handsfree with a lower h to refer to an instance, like: const handsfree = new Handsfree()
 * 
 * ---
 * 
 * # Globals
 * The following globals are added when using handsfree.js:
 * 
 * - `Handsfree`
 * - `HandsfreePose`
 * 
 * ---
 * 
 * # HOW TO HELP
 * - For improvements to the cursor, @see /handsfree.js/components/Cursor.js
 * - For details about BRFv4 and the faces object @see https://github.com/Tastenkunst/brfv4_javascript_examples
 * 
 * - Star and fork the project on GitHub @see https://github.com/labofoz/handsfreejs
 * - Check out existing issues @see https://github.com/labofoz/handsfreejs/issues
 * - Search this project for "@todo"
 * ---
 * 
 * @see handsfree.js.org
 * @see https://github.com/labofoz/handsfreejs
 * @see https://glitch.com/@handsfreejs
 * @see https://unpkg.com/handsfree/@<4/dist/handsfree.js
 * @see https://twitter.com/labofoz
 * 
 */
const {trimStart, merge, forEach} = require('lodash')

class Handsfree {
  /**
   * Doing nothing by default (eg: new Handsfree()) would:
   * - Inject and hide necessary video/canvas elements
   * - Begin downloading the BRFv4 model (~9mb)
   * 
   * @param {Object} opts The config object, @see /README.md
   * 
   * @emits handsfree:instantiated Helps disconnected parts of your app know that handsfree is ready
   */
  constructor (opts = {}) {
    /**
     * A collection of pose objects {face} for this.settings.maxPoses
     */
    this.pose = []

    /**
     * Your settings
     * - This really just acts as a namespace for plugins to pull settings from
     * - To set a setting during instantiation, use:
     *    const handsfree = new Handsfree({setting: {mySetting: value}})
     */
    this.opts = opts
    opts.settings = opts.settings || {}
    this.settings = merge(defaultSettings, opts.settings)

    /**
     * This will store all the plugins by name: handsfree.use({name: 'myPlugin})
     * - Adds it in here as: handsfree.plugin{myPlugin: {...}}
     * - And if you need to acess a plugin, just use: handsfree.plugin[pluginName]
     */
    this.plugin = {}

    /**
     * Contains a collection of all the handsfree.on(eventName, callback)
     * - Everytime you `handsfree.on(eventName, callback)`, it's added to
     *   as: `this.listening[eventName].push(callback)`
     * - Calling `handsfree.off()` will stop listening to events
     */
    this.listening = {}

    /**
     * Contains the state of the core debugger, which includes:
     * - <div> container with
     * -- a <video> to grab the webcam stream from
     * -- a <canvas> to draw debug info on
     */
    this.debug = {
      // Whether to show the core debugger (true) or not (false)
      isEnabled: !!opts.debug,
      // Whether we're actually debugging or not
      isDebugging: false,
      // The webcam stream
      $webcam: null,
      // The canvas to display debug info on
      $canvas: null,
      // The canvas context
      ctx: null,
      // The wrapping element
      $wrap: null
    }

    /**
     * Configs for trackers
     */
    this.tracker = {
      brf: {
        // Whether BRFv4 is disabled or not
        _isDisabled: !this.settings.tracker.brf.enabled,
        // The BRFv4 model
        model: null,
        // Whether the BRFv4 model has been loaded
        isReady: false,
        // Whether the model is being loaded or not
        isLoading: false,
      },
      posenet: {
        // Whether posenet is disabled or not
        _isDisabled: !this.settings.tracker.posenet.enabled,
        // The PoseNet model
        model: null,
        // Whether the posenet model has been loaded
        isReady: false,
        // Whether the model is being loaded or not
        isLoading: false,
      }
    }

    /**
     * Configs for BRFv4
     * @see https://tastenkunst.github.io/brfv4_docs/
     */
    this.brf = {
      // Will fallback to ASM if Web ASM isn't supported
      baseURL: `${Handsfree.libPath}brf/`,
      // The BRFv4 Manager
      manager: {},
      // The BRFv4 Resolution
      resolution: null,
      // The loaded BRFv4 sdk library
      sdk: null,
      // The SDK version we're using
      sdkName: 'BRFv4_JS_TK110718_v4.1.0_trial',
      // The Web ASM buffer
      WASMBuffer: null
    }

    /**
     * Cursor properties
     * @todo This should be an array for multi-user support @see https://github.com/BrowseHandsfree/handsfreeJS/issues/46
     */
    this.cursor = {
      // Position on window
      x: -100,
      y: -100,
      // The actual cursor element
      $el: null
    }
    // Helper object to remove jittering
    this.tweenFaces = []
    this.tweenBody = []

    // True when webcam stream is set and poses are being tracked
    // - this.isTracking && requestAnimationFrame(Handsfree.trackPoses())
    this.isTracking = false
    // Whether Web Assembly is supported
    this.isWASMSupported = typeof WebAssembly === 'object'
    // Whether handsfree is supported
    this.isSupported = this.checkForMediaSupport()

    /**
     * Initialize the instance
     * Let the browser know that we've finished instantiated
     */
    this.init()
    this.toggleCursor(!opts.hideCursor)
    document.body.classList.add('handsfree-stopped')
    window.dispatchEvent(new CustomEvent('handsfree:instantiated', {detail: opts}))
  }

  /**
   * Starts the webcam stream
   * - Adds .handsfree-started and removes -handsfree-stopped from the <body>
   * - This stream is completely killed when handsfree.stop() is called
   * -- A new stream is therefore created every time handsfree.start() is called after handsfree.stop()
   * -- This takes a few moments to happen (less than a second in my experience)
   * - If models are not initialized, it'll do so first
   * - If models are initialized, it'll start pose estimation
   * 
   * @emits handsfree:loading {detail: {progress: 0}} Useful giving user feedback
   */
  start () {
    this.toggleDebugger(this.debug.isEnabled)
    document.body.classList.add('handsfree-started')
    document.body.classList.remove('handsfree-stopped')
    window.dispatchEvent(new CustomEvent('handsfree:loading', {detail: {progress: 0}}))

    window.navigator.mediaDevices.getUserMedia(this.settings.webcam).then(mediaStream => {
      this.debug.$webcam.srcObject = mediaStream
      this.debug.$webcam.play()
      this.onStartHooks()

      if (this.settings.tracker.brf.enabled) {
        if (!this.brf.sdk) {
          window.dispatchEvent(new CustomEvent('handsfree:loading', {detail: {progress: 10}}))
          this.startBRFv4()
        } else {
          window.dispatchEvent(new CustomEvent('handsfree:loading', {detail: {progress: 100}}))
          this.isTracking = true
          this.brf.manager.setNumFacesToTrack(this.settings.maxPoses)
          this.trackPoses()
        }
      } else if (this.settings.tracker.posenet.enabled) {
        this.isTracking = true
        this.resizeCanvas()
        this.trackPoses()
      }
    })
  }

  /**
   * Stop tracking and release webcam streams
   * - Removes .handsfree-started and adds .handsfree-stopped to <body>
   * - Kills all webcam streams
   * - Disables debugger
   */
  stop () {
    document.body.classList.remove('handsfree-started')
    document.body.classList.add('handsfree-stopped')

    if (this.isTracking) {
      this.isTracking = false
      this.debug.$webcam.srcObject.getTracks().forEach(track => track.stop())
      this.toggleDebugger(false)
      this.onStopHooks()
    }
  }

  /**
   * Goes through and tracks poses for all active models
   */
  trackPoses () {
    this.debug.ctx.clearRect(0, 0, this.debug.$canvas.width, this.debug.$canvas.height)

    // BRFv4 (face tracker)
    if (!this.tracker.brf._isDisabled && this.tracker.brf.isReady) {
      this.trackFaces()
    }

    // PoseNet (full body pose estimator)
    if (!this.tracker.posenet._isDisabled && this.tracker.posenet.isReady) {
      this.trackBody()
    }

    // Do things with poses
    this.setPosesFromCache()
    this.debug.isDebugging && this.debugPoses()
    this.getCursors()
    this.setTouchedElement()
    this.onFrameHooks(this.pose)

    /**
     * Dispatch global event and reloop
     * - Only reloops if .isTracking
     */
    window.dispatchEvent(new CustomEvent('handsfree:trackPoses', {detail: {
      scope: this,
      poses: this.pose
    }}))
    this.isTracking && requestAnimationFrame(() => this.trackPoses())
  }

  /**
   * Sets the cursor, based on the dominant tracker
   */
  getCursors () {
    if (!this.tracker.brf._isDisabled) {
      this.getBRFCursors()
    } else if (!this.tracker.posenet._isDisabled) {
      this.getPoseNetCursors()
    }
  }
  
  /**
   * Updates this.pose with cached data
   */
  setPosesFromCache () {
    forEach(this.poseCache, (cache, pose) => {
      for (let i = 0; i < cache.length; i++) {
        this.pose[i][pose] = cache[i]
      }
    })
  }
  
  /**
   * Returns the element under the cursor and stores it as pose.cursor.$target
   * - If there's no target, then null is returned
   * 
   * @todo move this to Cursor.js
   */
  setTouchedElement () {
    this.pose.forEach(pose => {
      if (pose.cursor && pose.cursor.x && pose.cursor.y) {
        pose.cursor.$target = document.elementFromPoint(pose.cursor.x, pose.cursor.y)
      }
    })
  }

  /**
   * Dispatches an event to `handsfree:${eventName}`
   * 
   * @param {String} eventName The event name to dispatch, appended to `handsfree:`
   * @param {Any} args Any extra arguments to pass
   */
  dispatch (eventName, ...args) {
    window.dispatchEvent(new CustomEvent(`handsfree:${eventName}`, {detail: args}))
  }

  /**
   * Adds a listener to `handsfree:${eventName}`
   * - The callback receives the arguments, not the event object
   * - Passes over any additional arguments
   * 
   * @param {String}   eventName The event name to call, appended to `handsfree:`
   * @param {Function} callback  The callback to call
   */
  on (eventName, callback) {
    const self = this
    const handler = function (ev) {callback.call(self, ev)}
    window.addEventListener(`handsfree:${eventName}`, handler)

    if (!this.listening[eventName]) this.listening[eventName] = []
    this.listening[eventName].push(handler)
  }

  /**
   * Stops listening to events
   * @param {String} eventName The event name to stop listening to
   * - Leave empty to turn off ALL events
   */
  off (eventName = null) {
    // Remove by name
    if (eventName) {
      // Only remove listeners that exist
      if (this.listening[eventName]) {
        this.listening[eventName].forEach(callback => {
          window.removeEventListener(`handsfree:${eventName}`, callback)
        })
        delete this.listening[eventName]
      }
    // Remove all
    } else {
      forEach(this.listening, (callback, eventName) => {this.off(eventName)})
    }
  }

  /**
   * Toggle Cursor
   * @param {Boolean|Null} state Whether to turn it on (true), off (false), or flip between the two (null)
   */
  toggleCursor (state = null) {
    if (typeof state === 'boolean') this.settings.hideCursor = !state
    else this.settings.hideCursor = !this.settings.hideCursor

    if (this.settings.hideCursor) {
      document.body.classList.add('handsfree-hide-cursor')
    } else {
      document.body.classList.remove('handsfree-hide-cursor')
    }
  }
}

/**
 * Configs
 * @todo make use of environment variables too @see https://github.com/BrowseHandsfree/handsfreeJS/issues/48
 */
const defaultSettings = require('./config/default-settings')
const pkg = require('../package.json')

// Add class to body to style loading
document.body.classList.add('handsfree-is-loading')

// Set the lib path to whereever this file is, this is required for loading the BRFv4 SDK
const libSrc = document.currentScript.getAttribute('src')
Handsfree.libPath = trimStart(libSrc.replace('handsfree.js', ''), '/')

// Set the lib domain too
if (libSrc[0] === '/' || libSrc.substring(0, 4) !== 'http') {
  Handsfree.libDomain = window.location.origin + '/' + Handsfree.libPath
} else {
  Handsfree.libDomain = Handsfree.libPath
}

// Let the magic begin ✨
require('./methods/Setup')(Handsfree)
require('./methods/Util')(Handsfree)
require('./methods/Debug')(Handsfree)
require('./methods/Plugin')(Handsfree)
require('./trackers/BRF')(Handsfree)
require('./trackers/PoseNet')(Handsfree)

// Finally, include stylesheets
Handsfree.version = pkg.version
require('../public/handsfree.styl')
module.exports = Handsfree