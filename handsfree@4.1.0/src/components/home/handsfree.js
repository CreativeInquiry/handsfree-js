/**
 * Sets up the Paper.js demo
 */
const paper = require('paper')
window.paper = paper
let $canvas = document.getElementById('paperjs')
let path
let tool

/**
 * Plugin for drawing on paper with handsfree
 */
window.addEventListener('load', () => {
  const handsfree = window.handsfree
  
  handsfree.use({
    name: 'PaperDraw',

    lastPoint: [],

    reInit () {
      // Setup Paper.js
      $canvas = document.getElementById('paperjs')
      paper.setup($canvas)
      path = new paper.Path()
      tool = new paper.Tool()
      tool.minDistance = 20
    },

    /**
     * Start path, select new color
     */
    onMouseDown (pose, poseIndex) {
      if (!$canvas || pose.cursor.$target !== $canvas) return

      this.setLastPoint(pose, poseIndex)
      path = new paper.Path()
      path.strokeColor = {
        hue: Math.random() * 360,
        saturation: 1,
        brightness: 1
      }
      path.strokeJoin = 'round'
      path.strokeWidth = pose.face.scale / 10
      path.moveTo(this.lastPoint[poseIndex])
    },

    /**
     * Draw the path
     */
    onMouseDrag (pose, poseIndex) {
      if (!$canvas || pose.cursor.$target !== $canvas) return
      const newPoint = this.getPoint(pose)

      if (newPoint.getDistance(this.getLastPoint(poseIndex)) > tool.minDistance) {
        path.strokeWidth = Math.max(pose.face.scale / 2 - 50, 1)
        path.lineTo(new paper.Point(
          pose.cursor.x - $canvas.getBoundingClientRect().left,
          pose.cursor.y - $canvas.getBoundingClientRect().top
        ))
        paper.view.draw()
        path.smooth()

        this.setLastPoint(pose, poseIndex)
      }
    },

    /**
     * Gets a paper point from a pose
     * @param  {poseObject} pose The full pose object
     * @return {Point}           The point
     */
    getPoint (pose) {
      return new paper.Point(
        pose.cursor.x - $canvas.getBoundingClientRect().left,
        pose.cursor.y - $canvas.getBoundingClientRect().top
      )
    },

    /**
     * Sets the last point for the poseIndex
     */
    setLastPoint (pose, poseIndex) {
      this.lastPoint[poseIndex] = this.getPoint(pose)
    },

    /**
     * Gets the last point for the poseIndex
     */
    getLastPoint (poseIndex) { return this.lastPoint[poseIndex] }
  })

  // Setup Paper.js
  window.paper = paper
  paper.setup($canvas)
  path = new paper.Path()
  tool = new paper.Tool()
  tool.minDistance = 20

  /**
   * Adapted from: http://paperjs.org/tutorials/interaction/working-with-mouse-vectors/
   */
  tool.onMouseDown = function (event) {
    path = new paper.Path()
    path.strokeColor = {
      hue: Math.random() * 360,
      saturation: 1,
      brightness: 1
    }
    path.strokeWidth = 10
    path.strokeJoin = 'round'
    path.add(event.point)
  }

  /**
   * Handle mouseDrag
   */
  tool.onMouseDrag = function (event) {
    path.add(event.point)
    path.smooth()
  }
})