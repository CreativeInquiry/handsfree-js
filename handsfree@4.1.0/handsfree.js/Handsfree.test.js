beforeEach(() => {
  handsfree = new Handsfree()
})

/**
 * Handsfree Constructor
 */
describe('Handsfree Constructor', () => {
  /**
   * - Let's add .handsfree-stopped to the body once we're instantiated for CSS
   * - Let's emit an event for better 3rd party integration
   */
  it('sets body class after instantiation and emits handsfree:instantiated', () => {
    const cb = jest.fn()
    window.addEventListener('handsfree:instantiated', cb)
    document.body.classList.remove('handsfree-stopped')
    
    new Handsfree()
    expect(document.body.classList).toContain('handsfree-stopped')
    expect(cb).toHaveBeenCalled()

    window.removeEventListener('handsfree:instantiated', cb)
  })
})

/**
 * Handsfree.prototype.start
 * - Start trackers, initializing them if needed
 * - Runs plugin .onStart()'s
 */
describe('Handsfree.prototype.start', () => {
  /**
   * - Let's notify the client that handsfree is loading for CSS and events
   */
  it('sets body classes and emmits handsfree:loading', async () => {
    document.body.classList.remove('handsfree-started')
    document.body.classList.add('handsfree-stopped')
    let progress = -1
    const cb = ev => {progress = ev.detail.progress}
    window.addEventListener('handsfree:loading', cb)
    
    handsfree._injectDebugger()
    await handsfree._start()
    expect(document.body.classList).toContain('handsfree-started')
    expect(document.body.classList).not.toContain('handsfree-stopped')
    expect(progress).not.toBe(-1)

    window.removeEventListener('handsfree:loading', cb)
  })

  /**
   * - If BRFv4 hasn't loaded then load it
   * - If BRFv4 has loaded then start tracking
   */
  it('Starts tracking when brfv4 is already setup', async () => {
    let progress = -1
    const cb = ev => {progress = ev.detail.progress}
    window.addEventListener('handsfree:loading', cb)

    handsfree._injectDebugger()
    handsfree.brf.sdk = true
    handsfree.brf.manager = {setNumFacesToTrack: jest.fn()}

    await handsfree._start()
    expect(progress).not.toBe(-1)
    window.removeEventListener('handsfree:loading', cb)
  })

  /**
   * onStart events should not be called on plugins that are already running
   * @see /test/mock-handsfree.js > Handsfree._mock
   */
  it('calls enabled plugin onStart events only once', async () => {
    handsfree._injectDebugger()
    Handsfree._mock.restore(handsfree, 'onStartHooks')
    Handsfree._mock.plugins(handsfree)
    await handsfree._start()

    expect(Handsfree._mock.spy.onStart).toBe(2)
  })
})

/**
 * Stop Webcam
 * - Run all plugin hooks
 */
describe('Handsfree.prototype.stop', () => {
  it('sets up body classes', () => {
    document.body.classList.remove('handsfree-stopped')
    document.body.classList.add('handsfree-started')
    handsfree._stop()

    expect(document.body.classList).toContain('handsfree-stopped')
    expect(document.body.classList).not.toContain('handsfree-started')
  })

  it('runs enabled plugin onStopHooks', () => {
    handsfree._injectDebugger()
    Handsfree._mock.restore(handsfree, 'onStopHooks')
    Handsfree._mock.plugins(handsfree)
    handsfree.debug.$webcam.srcObject = {getTracks: () => []}

    handsfree.isTracking = false
    handsfree._stop()
    expect(Handsfree._mock.spy.onStop).toBe(0)

    handsfree.isTracking = true
    handsfree._stop()
    expect(Handsfree._mock.spy.onStop).toBe(1)
  })
})

/**
 * Handsfree.prototype.trackPoses
 */
describe('Handsfree.prototype.trackPoses', () => {
  it('calls enabled plugin onFrameHooks', () => {
    handsfree._injectDebugger()
    Handsfree._mock.plugins(handsfree)
    Handsfree._mock.brfv4(handsfree)
    Handsfree._mock.restore(handsfree, 'onFrameHooks')

    handsfree._trackPoses()
    expect(Handsfree._mock.spy.onFrame).toBe(2)
  })

  it('keeps loop until isTracking is false', () => {
    const raf = requestAnimationFrame
    requestAnimationFrame = jest.fn()
    handsfree._injectDebugger()

    Handsfree._mock.plugins(handsfree)
    Handsfree._mock.brfv4(handsfree)
    Handsfree._mock.restore(handsfree, 'onFrameHooks')

    handsfree.isTracking = false
    handsfree._trackPoses()
    expect(requestAnimationFrame).not.toHaveBeenCalled()

    handsfree.isTracking = true
    handsfree._trackPoses()
    expect(requestAnimationFrame).toHaveBeenCalled()
    requestAnimationFrame = raf
  })

  it('dispatches correct events', () => {
    const cb = jest.fn()
    handsfree._injectDebugger()
    Handsfree._mock.brfv4(handsfree)
    window.addEventListener('handsfree:trackPoses', cb)

    handsfree._trackPoses()
    expect(cb).toHaveBeenCalled()
    window.removeEventListener('handsfree:trackPoses', cb)
  })
})

/**
 * Handsfree.prototype.on
 */
describe('Handsfree.prototype.on', () => {
  it('Adds event listener', () => {
    const cb = jest.fn()
    handsfree._on('test123', cb)
    window.dispatchEvent(new CustomEvent('handsfree:test123'))
    expect(cb).toHaveBeenCalled()
  })

  it('Adds the event to .listening', () => {
    handsfree._on('test111', jest.fn())
    expect(handsfree.listening['test111'].length).toBe(1)
    handsfree._on('test111', jest.fn())
    expect(handsfree.listening['test111'].length).toBe(2)
  })
})

/**
 * Handsfree.prototype.off
 */
describe('Handsfree.prototype.off', () => {
  const cb1 = jest.fn()
  const cb2 = jest.fn()

  beforeEach(() => {
    cb1.mockClear()
    cb2.mockClear()
    window.addEventListener('test-off-1', cb1)
    window.addEventListener('test-off-2', cb2)
    handsfree._on('test-off-1', cb1)
    handsfree._on('test-off-2', cb2)
  })

  afterEach(() => {
    window.removeEventListener('test-off-1', cb1)
    window.removeEventListener('test-off-2', cb2)
  })
  
  it('removes listeners by name', () => {
    handsfree._off('test-off-1')
    window.dispatchEvent(new CustomEvent('handsfree:test-off-1'))
    window.dispatchEvent(new CustomEvent('handsfree:test-off-2'))
    expect(cb1).not.toHaveBeenCalled()
    expect(cb2).toHaveBeenCalled()
    handsfree._off('test-off-2')
  })

  it('removes all listeners', () => {
    Handsfree._mock.restore(handsfree, 'off')
    handsfree.off()
    window.dispatchEvent(new CustomEvent('handsfree:test-off-1'))
    window.dispatchEvent(new CustomEvent('handsfree:test-off-2'))
    expect(cb1).not.toHaveBeenCalled()
    expect(cb2).not.toHaveBeenCalled()
  })
})