const {forEach, merge, sortBy} = require('lodash')

module.exports = Handsfree => {
  /**
   * Adds a plugin
   * 
   * @param {Object} config The config object, in the form:
   * {
   *   // [required] The plugin name, which is how you access it: handsfree.plugin[pluginName]
   *   name: {String},
   *
   *   // Called once when the .use method is called and after the plugin is added to the instance
   *   onUse: {Function (pose)},
   *
   *   // Called once per frame, after calculations
   *   onFrame: {Function}
   * }
   * 
   * @returns {Plugin Object} A reference to the plugin at handsfree.plugin[config.name]
   */
  Handsfree.prototype.use = function (config) {
    // Setup defaults
    config = this.plugin[config.name] = merge({
      // The priority this plugin's methods should be called in, lower go first
      priority: 10,

      // The reference to the handsfree instance
      $handsfree: this,
      
      // Whether the plugin is disabled (true) or not (false)
      // - Disabled plugins don't run their hooks
      _isDisabled: false,

      // Helper for disabling the plugin
      disable: function () {
        this._isDisabled = true
        this.onDisable && this.onDisable(this)
      },

      // Helper for enabling the plugin
      enable: function () {
        this._isDisabled = false
        this.onEnable && this.onEnable(this)
      }
    }, config)
    
    // Call onMouseDown, onMouseDrag, onMouseUp
    if (config.onMouseDown) window.addEventListener('handsfree:mouseDown', (ev) => {!config._isDisabled && config.onMouseDown(ev.detail.pose, ev.detail.id)})
    if (config.onMouseDrag) window.addEventListener('handsfree:mouseDrag', (ev) => {!config._isDisabled && config.onMouseDrag(ev.detail.pose, ev.detail.id)})
    if (config.onMouseUp) window.addEventListener('handsfree:mouseUp', (ev) => {!config._isDisabled && config.onMouseUp(ev.detail.pose, ev.detail.id)})
    
    // Prioritize plugins
    let newPlugins = {}
    let oldPlugins = Object.values(this.plugin)
    sortBy(oldPlugins, 'priority').forEach(plugin => {
      newPlugins[plugin.name] = plugin
    })
    this.plugin = newPlugins
    
    // Call onUse hook
    !config._isDisabled && config.onUse && setTimeout(() => config.onUse(this), 0)
    
    return this.plugin[config.name]
  }

  /**
   * Called when .stop() is called
   */
  Handsfree.prototype.onStopHooks = function () {
    forEach(this.plugin, (config) => {
      !config._isDisabled && config.onStop && config.onStop.call(config, this)
    })
  }

  /**
   * Called once per frame, after calculations
   */
  Handsfree.prototype.onStartHooks = function () {
    forEach(this.plugin, (config) => {
      !config._isDisabled && config.onStart && config.onStart.call(config, this)
    })
  }

  /**
   * Called once per frame, after calculations
   */
  Handsfree.prototype.onFrameHooks = function (poses) {
    forEach(this.plugin, (config) => {
      if (!config._isDisabled && config.onFrame) {
        const newPoses = config.onFrame.call(config, poses, this)
        if (newPoses) this.pose = newPoses
      }
    })
  }

  /**
   * Loads all the core plugins
   */
  Handsfree.prototype.loadPlugins = function () {
    this.use(require('../plugins/Scrolling'))
    this.use(require('../plugins/SmileClick'))
    this.use(require('../plugins/SimpleKeyboard'))
  }
}
