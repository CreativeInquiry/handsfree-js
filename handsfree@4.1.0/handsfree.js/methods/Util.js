module.exports = Handsfree => {
  /**
   * Checks that the environment supports this project,
   * by peaking into the available canvas API
   */
  Handsfree.prototype.checkForMediaSupport = function () {
    let isSupported = false

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        let canvas = document.createElement('canvas')
        isSupported = !!canvas.getContext('webgl')
        canvas.remove()
      } catch (e) {
        this.throwError('ERROR: This browser does not support webcams, please try another browser...like Google Chrome!')
      }
    } else {
      this.throwError('ERROR: This browser does not support webcams, please try another browser...like Google Chrome!')
    }

    return isSupported
  }

  /**
   * Throws an error by notifiying the user
   * @param  {String} msg The message to display
   */
  Handsfree.prototype.throwError = function (msg) {
    // eslint-disable-next-line no-console
    console.error(msg)
    alert(msg)
    throw new Error(msg)
  }

  /**
   * Converts a position to a tuple
   * - Essentially converts an {x, y} object into a [y, x] array
   *
   * @param {OBJ} position {x, y}
   */
  Handsfree.prototype.toTuple = function ({x, y}) {return [y, x]}
}
