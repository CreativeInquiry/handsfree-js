/**
 * Mock each property indvidivually
 * - Exposes Handsfree.prototype._mock()
 * -- Each prop is set to _${propName}
 * -- Original prop is set to jest.fn()
 * -- Calling this method clears all mocks
 */
const {get, set} = require('lodash')

// Make Handsfree globally accessible
global.Handsfree = require('../../handsfree.js/Handsfree')
global.handsfree = null

Object.getOwnPropertyNames(Handsfree.prototype).forEach((propName) => {
  Handsfree.prototype[`_${propName}`] = Handsfree.prototype[propName]
  Handsfree.prototype[propName] = jest.fn()
})

/**
 * Quick restart points
 */
Handsfree._mock = {
  // Handsfree._mock.plugins()
  plugins: require('./plugins'),

  pose: [...require('../../src/store/faces/1-wink-face.json')],

  // Monitor number of times things were called
  spy: {
    // Number of times plugin onStart was called
    onStart: 0,
    // Number of times plugin onStop was called
    onStop: 0,
    // Number of times plugin onFrame was called
    onFrame: 0,
    // Array containing plugins called, in order (use Handsfree._mock.spy.onUse.length for count)
    onUse: []
  },

  /**
   * We've mocked each prop/method individually, but internal method
   * calls are still made to the now mocked method.
   * 
   * This restores a mocked method to what it was, by name:
   * Handsfree._mock.restore(handsfree, 'onStartHooks')
   * 
   * @param mocked The Handsfree instance to effect
   * @param propName The Handsfree.prototype[propName] to restore
   */
  restore (mocked, propName) {
    const mockedProp = get(mocked, `_${propName}`)
    set(mocked, propName, mockedProp)
  },

  /**
   * Mocks BRFv4 on an instance
   * @param mocked The Handsfree instance to effect
   */
  brfv4 (mocked) {
    mocked.brf.resolution = {width: 640, height: 480}
    mocked.brf.manager = {
      update: jest.fn(),
      getFaces: () => []
    }
  }
}