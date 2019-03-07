/**
 * Handsfree.prototype.injectDebugger
 */
describe('Handsfree.prototype.injectDebugger', () => {
  it('can create debug elements and dispatch event', () => {
    const handsfree = new Handsfree()
    const cb = jest.fn()
    window.addEventListener('handsfree-injectDebugger', cb)
    
    handsfree._injectDebugger()
    expect(document.querySelector('.handsfree-debugger')).toBeTruthy()
    expect(document.querySelector('.handsfree-webcam')).toBeTruthy()
    expect(document.querySelector('.handsfree-canvas')).toBeTruthy()
    expect(cb).toHaveBeenCalled()
  })

  it('injects debugger into correct place', () => {
    const handsfree = new Handsfree()

    handsfree._injectDebugger()
    const $debugger = document.querySelector('body > .handsfree-debugger')
    expect($debugger).toBeTruthy()
    $debugger.remove()

    const $wrap = document.createElement('div')
    $wrap.classList.add('handsfree-debug-wrap')
    document.body.appendChild($wrap)
    handsfree._injectDebugger()
    expect(document.querySelector('body > .handsfree-debugger')).toBeNull()
    expect(document.querySelector('body > .handsfree-debug-wrap > .handsfree-debugger')).toBeTruthy()
  })
})

/**
 * Handsfree.prototype.getPointColor
 */
describe('Handsfree.prototype.getPointColor', () => {
  it('should get correct point colors', () => {
    expect(Handsfree.prototype._getPointColor(48)).toBe('#f0f')
    expect(Handsfree.prototype._getPointColor(36)).toBe('#0f0')
    expect(Handsfree.prototype._getPointColor(27)).toBe('#f00')
    expect(Handsfree.prototype._getPointColor(0)).toBe('#ff0')
  })
})

/**
 * Handsfree.prototype.toggleDebugger
 */
describe('Handsfree.prototype.toggleDebugger', () => {
  it('sets state based on argument', () => {
    const handsfree = new Handsfree()
    handsfree._injectDebugger()

    handsfree._toggleDebugger(false)
    expect(handsfree.debug.isDebugging).toBe(false)
    handsfree._toggleDebugger(true)
    expect(handsfree.debug.isDebugging).toBe(true)
    handsfree._toggleDebugger()
    expect(handsfree.debug.isDebugging).toBe(false)
  })
})