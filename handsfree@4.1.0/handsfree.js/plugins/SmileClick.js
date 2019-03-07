/**
 * Activate clicks with a smile
 * @type {Object}
 */
module.exports = {
  name: 'SmileClick',

  priority: 9,
  
  mouseDowned: [],
  mouseDown: [],
  mouseDrag: [],
  mouseUp: [],

  onFrame: function (poses, instance) {
    if (!poses[0].face) return
    
    poses.forEach((pose, poseIndex) => {
      const face = pose.face
      let a
      let b
      let smileFactor

      // Calculate mouth width
      a = face.points[48].x - face.points[54].x
      b = face.points[48].y - face.points[54].y
      const mouthWidth = Math.sqrt(a*a + b*b)

      // Calculate eye distance
      a = face.points[39].x - face.points[42].x
      b = face.points[39].y - face.points[42].y
      const eyeDistance = Math.sqrt(a*a + b*b)

      // Calculate smile factor
      smileFactor = mouthWidth / eyeDistance
      smileFactor -= 1.4 - instance.settings.sensitivity.click // 1.4 === neutral, 1.7 === smiling

      if (smileFactor > 0.25) smileFactor = 0.25
      if (smileFactor < 0) smileFactor = 0
      smileFactor *= 4

      if (smileFactor < 0) smileFactor = 0
      if (smileFactor > 1) smileFactor = 1

      // Update states and fire events
      instance.pose[poseIndex].cursor.state = this.updateMouseStates({
        pose,
        poseIndex,
        instance,
        smileFactor
      })
      this.maybeFireEvents(instance.pose, poseIndex)
    })

    return instance.pose
  },

  /**
   * Updates the mouse events
   * @return new states
   */
  updateMouseStates (state) {
    if (state.smileFactor >= 1) {
      this.mouseDrag[state.poseIndex] = this.mouseDowned[state.poseIndex]
      // Every frame after first frame of click
      if (this.mouseDowned[state.poseIndex]) {
        this.mouseDown[state.poseIndex] = false
      // First frame of click
      } else {
        this.mouseDowned[state.poseIndex] = true
        this.mouseDown[state.poseIndex] = true
      }
      this.triggerClick(state.pose, state.poseIndex)

      // Styles
      state.instance.pose[state.poseIndex].cursor.$el.style.background = '#f00'
      state.instance.pose[state.poseIndex].cursor.$el.style.border = '2px solid #ff0'
      state.instance.pose[state.poseIndex].cursor.$el.classList.add('handsfree-clicked')
    } else {
      this.mouseUp[state.poseIndex] = this.mouseDowned[state.poseIndex]
      this.mouseDowned[state.poseIndex] = this.mouseDrag[state.poseIndex] = this.mouseDown[state.poseIndex] = false

      // Styles
      state.instance.pose[state.poseIndex].cursor.$el.style.background = '#ff0'
      state.instance.pose[state.poseIndex].cursor.$el.style.border = '2px solid #f00'
      state.instance.pose[state.poseIndex].cursor.$el.classList.remove('handsfree-clicked')
    }

    return {
      mouseDown: this.mouseDown[state.poseIndex],
      mouseDrag: this.mouseDrag[state.poseIndex],
      mouseUp: this.mouseUp[state.poseIndex]
    }
  },

  /**
   * Maybe fire events
   */
  maybeFireEvents (poses, index) {
    const state = poses[index].cursor.state
    let eventName = ''
    
    if (state.mouseDown) {
      eventName = 'mouseDown'
    } else if (state.mouseDrag) {
      eventName = 'mouseDrag'
    } else if (state.mouseUp) {
      eventName = 'mouseUp'
    }

    if (eventName) {
      window.dispatchEvent(new CustomEvent(`handsfree:${eventName}`, {
        detail: {
          pose: poses[index],
          id: index
        }
      }))
    }
  },

  /**
   * Triggers a click
   * - Fires a click event
   * - Focuses the element if it's focusable
   *
   * @param {Object}  pose  The pose object
   * @param {Integer} index The pose index
   */
  triggerClick: function (pose, index) {
    const $el = pose.cursor.$target

    if ($el && this.mouseDown[index]) {
      // Click
      $el.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        clientX: pose.cursor.x,
        clientY: pose.cursor.y
      }))

      // Focus
      if (['INPUT', 'TEXTAREA', 'BUTTON', 'A'].includes($el.nodeName))
        $el.focus()
    }
  }
}
