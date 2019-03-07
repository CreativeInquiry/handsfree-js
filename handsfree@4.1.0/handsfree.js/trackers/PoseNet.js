/**                              
 *                                   .o o.
 *          ✨	                        o
 *           (\.   \      ,/)       __|__	 o
 *            \(   |\     )/       /  |  \/
 *            //\  | \   /\\       \ _=_
 *           (/ /\_#👓#_/\ \)      o|  | 
 *             \/\  ####  /\/        o  o
 *                  `##'            |  |
 *                                  L  L
 *         
 *          🔮 handsfree.js/trackers/PoseNet.js 🔮
 * 
 * @description Loads a full body pose estimator into `handsfree.trackers.posenet`
 * and populates:
 * - `handsfree.pose[].body`
 * 
 * @see /public/workers/posenet.js
 * @see https://github.com/tensorflow/tfjs-models/tree/master/posenet
 */
const PoseNet = require('@tensorflow-models/posenet')

module.exports = Handsfree => {
  /**
   * Initializes PoseNet
   * - Within a web worker if `this.settings.tracker.posenet.useWithWorker`
   */
  Handsfree.prototype.initPoseNet = async function () {
    if (!this.tracker.posenet.isLoading) {
      this.tracker.posenet.isLoading = true
      this.tracker.posenet.isReady = false
      this.tracker.posenet.model = await PoseNet.load(this.settings.tracker.posenet.multiplier)
      this.tracker.posenet.isLoading = false
      this.tracker.posenet.isReady = true
    }
  }
  
  /**
   * Toggles PoseNet on/off
   * - Also initializes posenet for the first time if it hasn't yet
   * 
   * @param {Boolean|Null} state Toggle the PoseNet tracker on (true), off (false), or flip it (pass nothing)
   */
  Handsfree.prototype.toggleBodyTracker = function (state) {
    if (typeof state === 'boolean') {
      this.tracker.posenet._isDisabled = state
    } else {
      this.tracker.posenet._isDisabled = !this.tracker.posenet._isDisabled
    }

    // Initialize posenet if it hasn'et been yet
    !this.tracker.posenet._isDisabled && !this.tracker.posenet.isReady && this.initPoseNet()
  }

  /**
   * Infer with PoseNet within the main thread
   */
  Handsfree.prototype.trackBody = async function () {
    let poses = []
    
    // Get single pose
    if (this.settings.maxPoses === 1) {
      let pose = await this.tracker.posenet.model.estimateSinglePose(this.debug.$webcam, this.settings.tracker.posenet.imageScaleFactor, false, this.settings.tracker.posenet.outputStride)
      poses = [pose]
      // Get multiple poses
    } else {
      poses = await this.tracker.posenet.model.estimateMultiplePoses(
        this.debug.$webcam, this.settings.tracker.posenet.imageScaleFactor, false, this.settings.tracker.posenet.outputStride,
        this.settings.maxPoses, this.settings.tracker.posenet.scoreThreshold, this.settings.tracker.posenet.nmsRadius)
    }

    this.pose.forEach((pose, i) => {pose.body = poses[i]})
  }

  /**
   * Loops through each pose and draws their keypoints/skeletons
   * - Draws skeletons and keypoints
   */
  Handsfree.prototype.debugPoseNetPoses = function () {
    const settings = this.settings.tracker.posenet
    this.pose.forEach(pose => {
      if (pose.body && pose.body.score >= settings.minPoseConfidence) {
        const adjacentKeypoints = PoseNet.getAdjacentKeyPoints(pose.body.keypoints, settings.minPartConfidence, this.debug.ctx)

        this.drawPoseNetSkeleton(adjacentKeypoints, this.debug.ctx)
        this.drawPoseNetKeypoints(pose.body.keypoints, settings.minPartConfidence, this.debug.ctx)
      }
    })
  }

  /**
   * Draw each tracked keypoint
   * - Draws keypoints only when they are "visible"
   *
   * @see https://github.com/tensorflow/tfjs-models/tree/master/posenet
   *
   * @param {ARR} keypoints The list of all keypoints
   * @param {NUM} minConfidence The minimum keypoint score needed to track
   * @param {OBJ} context The canvas context to draw into
   */
  Handsfree.prototype.drawPoseNetKeypoints = function (keypoints, minConfidence, context) {
    const scale = 1

    keypoints.forEach(({position, score}) => {
      if (score > minConfidence) {
        context.beginPath()
        context.arc(position.x * scale, position.y * scale, 15, 0, 2 * Math.PI)
        context.fillStyle = '#fff'
        context.strokeStyle = '#000'
        context.lineWidth = 3
        context.fill()
        context.stroke()
      }
    })
  }

  /**
   * Draw each tracked skeleton
   * @see https://github.com/tensorflow/tfjs-models/tree/master/posenet
   *
   * - Draws all visible segments captured with PoseNet.getAdjacentKeyPoints
   *
   * @param {ARR} adjacentPoints The list of all keypoints and their relationships
   * @param {OBJ} context The canvas context to draw into
   */
  Handsfree.prototype.drawPoseNetSkeleton = function (adjacentPoints, context) {
    adjacentPoints.forEach((keypoints) => {
      if (keypoints[0].part === 'leftElbow' || keypoints[1].part === 'leftElbow') {
        context.strokeStyle = '#f00'
      } else if (keypoints[0].part === 'rightElbow' || keypoints[1].part === 'rightElbow') {
        context.strokeStyle = '#0f0'
      } else if (keypoints[0].part === 'rightKnee' || keypoints[1].part === 'rightKnee') {
        context.strokeStyle = '#0ff'
      } else if (keypoints[0].part === 'leftKnee' || keypoints[1].part === 'leftKnee') {
        context.strokeStyle = '#f0f'
      } else {
        context.strokeStyle = '#ff0'
      }
      
      this.drawSegment(this.toTuple(keypoints[0].position), this.toTuple(keypoints[1].position), context)
    })
  }

  /**
   * Draws the skeleton segment
   * - A segment is a straight line between two tuples
   *
   * @param {OBJ} fromTuple [ay, ax] The starting point
   * @param {OBJ} toTuple [by, bx] The ending point
   * @param {HEX} color The color to draw in
   * @param {OBJ} context The canvas context to draw in
   */
  Handsfree.prototype.drawSegment = function ([ay, ax], [by, bx], context) {
    const scale = 1

    context.beginPath()
    context.moveTo(ax * scale, ay * scale)
    context.lineTo(bx * scale, by * scale)
    context.lineWidth = 10
    context.stroke()
  }

  /**
   * Entry point for our hacky calculations
   * - Calculates "pointedAt" for each pose
   */
  Handsfree.prototype.getPoseNetCursors = function () {
    this.pose.forEach((pose, i) => {
      if (!pose.body) return

      const nose = pose.body.keypoints[0]
      const envWidth = window.outerWidth
      const envHeight = window.outerHeight
      let poseAverages = 0

      // Helps map a point on the.canvas to a point on the window
      const ratio = {
        width: envWidth / this.debug.$canvas.width,
        height: envHeight / this.debug.$canvas.height
      }

      // First, let's get where on the screen we are if looking dead ahead
      // The canvas is mirrored, so left needs to be flipped
      let x = -nose.position.x * ratio.width + envWidth
      let y = nose.position.y * ratio.height

      // @FIXME Now let's adjust for rotation
      let yaw = this.calculatePoseNetHeadYaw(pose)
      let pitch = this.calculatePoseNetHeadPitch(pose)
      x += yaw * window.outerWidth / 2
      y += pitch * window.outerHeight / 2 - window.outerHeight

      // Let's add it to the stack
      this.tweenBody[i] = this.tweenBody[i] || []
      this.tweenBody[i].push({x, y})
      if (this.tweenBody[i].length > 10) this.tweenBody[i].shift()

      // Finally let's get the average
      poseAverages = this.poseNetTweening(this.tweenBody[i])
      x = poseAverages.x
      y = poseAverages.y

      // Update cursor
      pose.cursor.x = x;
      pose.cursor.y = y;

      // Update pointer and vars
      pose.cursor.$el.style.left = `${x}px`
      pose.cursor.$el.style.top  = `${y}px`

      // Assign values
      pose.body.angles = {pitch, yaw}
      this.pose[i] = pose
    })
  }

  /**
   * @FIXME Get the head's Yaw (looking left/right)
   * 👻 Let's unit test this AFTER we agree on a solid algorithm
   * 🧙 CAUTION HERO, FOR HERE BE 🐉 DRAGONS 🐉
   *
   * - 0* is you looking straight ahead
   * - 90* would be your head turned to the right
   * - -90* would be you looking to the left
   *
   * My basic algorithm is:
   *  1. What is the x distance from the nose to each eye?
   *
   *  2. The difference between these distances determines the angle
   *    - For this algorithm, angles are between -90 and 90 (looking left and right)
   *
   * Problems with this aglorithm:
   * - All of it
   */
  Handsfree.prototype.calculatePoseNetHeadYaw = function (pose) {
    const points = pose.body.keypoints
    let yaw = 0
    let distanceRatio
    let sideLookingAt

    // 1. What is the x distance from the nose to each eye?
    let eyeNoseDistance = {
      left: Math.abs(points[1].position.x - points[0].position.x),
      right: Math.abs(points[2].position.x - points[0].position.x)
    }

    // 2. The difference between these distances determines the angle
    if (eyeNoseDistance.left > eyeNoseDistance.right) {
      distanceRatio = 1 - eyeNoseDistance.right / eyeNoseDistance.left
      sideLookingAt = 1
    } else {
      distanceRatio = 1 - eyeNoseDistance.left / eyeNoseDistance.right
      sideLookingAt = -1
    }

    // Try to tame this beast into a radian
    yaw = ((distanceRatio * 90 * sideLookingAt) * Math.PI / 180)

    return yaw
  }

  /**
   * @FIXME Get the head's Pitch (looking up/down)
   * 👻 Let's unit test this AFTER we agree on a solid algorithm
   * 🧙 CAUTION HERO, FOR HERE BE 🐉 DRAGONS 🐉
   *
   * - 0* is you looking straight ahead
   * - 90* would be your head turned upwards
   * - -90* would be you head turned downwards
   *
   * My basic algorithm is:
   *  1. Calculate the average Y's for both ears (or whichever is visible)
   *  2. Calculate the distance the eyes are apart
   *  3. Calculate the distance between the nose and the averaged ear Y
   */
  Handsfree.prototype.calculatePoseNetHeadPitch = function (pose) {
    let yEarAverage = 0
    let numEarsFound = 0
    let eyeDistance = 0
    let distanceRatio = 0
    let points = pose.body.keypoints

    // 1. Calculate the average Y's for both ears (or whichever is visible)
    if (points[3].score >= this.settings.tracker.posenet.minPartConfidence) {
      numEarsFound++
      yEarAverage += points[3].position.y
    }
    if (points[4].score >= this.settings.tracker.posenet.minPartConfidence) {
      numEarsFound++
      yEarAverage += points[4].position.y
    }
    yEarAverage = yEarAverage / numEarsFound

    // 2. Calculate the distance the eyes are apart
    // - I am literally making this up as I go
    eyeDistance = points[1].position.x - points[2].position.x
    distanceRatio = (points[0].position.y - yEarAverage) / eyeDistance

    return (90 * distanceRatio) * Math.PI / 180
  }

  /**
   * @FIXME Averages the pose stacks to reduce "wobble"
   *
   * @param {Object} tweenBody The tweenBody to average out
   *
   * @return {Object} The averaged {x, y}
   */
  Handsfree.prototype.poseNetTweening = function (tweenBody) {
    let x = 0
    let y = 0

    tweenBody.forEach(pose => {
      x += pose.x
      y += pose.y
    })

    x = x / tweenBody.length
    y = y / tweenBody.length

    return {x, y}
  }
}