/**
 * Companion store for the Space Whale plugin
 */
export default {
  namespaced: true,

  state: {
    // The player camera
    camera: null,
    
    entity: {
      // The Babylone player entity
      player: null,

      // The skybox
      sky: {
        box: null,
        material: null
      }
    }
  }
}