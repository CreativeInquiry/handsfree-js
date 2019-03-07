/**
 * Handles page scrolling
 */
module.exports = {
  name: 'Scrolling',

  // The multiplier to scroll the page by
  // @TODO Implement this on handsfree.js.org
  scrollSpeed: 0.1,

  // Number of pixels from the top/bottom edge to start scrolling at
  scrollZone: 150,

  /**
   * Scrolls the page when the cursor is above/below the screen
   * @param {Array}     poses    The array of face objects
   */
  onFrame (poses) {
    if (!poses[0].face) return

    poses.forEach(pose => {
      let y = pose.cursor.y

      // Scroll the page
      if (y < this.scrollZone) {
        window.scrollTo(0, window.scrollY + (y - this.scrollZone) * this.scrollSpeed)
      } else if (y > window.innerHeight - this.scrollZone) {
        window.scrollTo(0, window.scrollY + (y - window.innerHeight + this.scrollZone) * this.scrollSpeed)
      }
    })
  }
}
