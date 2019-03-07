/**
 * Handsfree.prototype.onReadyHook
 */
describe('Handsfree.prototype.onReadyHook', () => {
  it('sets body classes and dispatches handsfree:ready', () => {
    const handsfree = new Handsfree()
    const cb = jest.fn()
    window.addEventListener('handsfree:ready', cb)
    handsfree._onReadyHook()
    
    expect(document.body.classList).toContain('handsfree-ready')
    expect(document.body.classList).not.toContain('handsfree-is-loading')
    expect(cb).toHaveBeenCalled()
    window.removeEventListener('handsfree:ready', cb)
  })
})