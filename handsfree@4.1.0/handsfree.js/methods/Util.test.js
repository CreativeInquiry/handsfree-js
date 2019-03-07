describe('Handsfree.prototype.checkForMediaSupport', () => {
  it('returns supported status and catches errors', () => {
    const handsfree = new Handsfree()
    const gum = navigator.mediaDevices.getUserMedia
    
    expect(handsfree._checkForMediaSupport()).toBe(true)
    navigator.mediaDevices.getUserMedia = false
    expect(handsfree._checkForMediaSupport()).toBe(false)

    navigator.mediaDevices.getUserMedia = true
    const createElement = document.createElement
    document.createElement = () => ({getContext: jest.fn(), remove: jest.fn(() => {throw true})})
    expect(handsfree._checkForMediaSupport()).toBe(false)

    navigator.mediaDevices.getUserMedia = gum
    document.createElement = createElement
  })
})

describe('Handsfree.prototype.throwError', () => {
  it('throws error', () => {
    const consoleErr = console.error
    console.error = jest.fn()

    try {Handsfree.prototype._throwError()} catch (e) {}
    expect(console.error).toHaveBeenCalled()
    alert = consoleErr
  })
})