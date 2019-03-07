const {forEach} = require('lodash')

/**
 * These will be run before each test
 */
global.beforeEach(() => {
  // Clear mocks
  jest.clearAllMocks()

  // Clear Handsfree Spies
  forEach(Handsfree._mock.spy, (val, key) => {
    Handsfree._mock.spy[key] = 0
  })

  // Remove debugger
  let $debuggers = document.querySelectorAll('.handsfree-debug-wrap, .handsfree-debugger')
  $debuggers.forEach($debugger => $debugger.remove())
})