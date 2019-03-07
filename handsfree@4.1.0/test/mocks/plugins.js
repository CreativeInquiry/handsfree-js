/**
 * Adds plugins to a handsfree instance
 */
module.exports = (handsfree) => {
  const plugins = [
    {
      name: 'test-disabled',
      _isDisabled: true,
      priority: 9999999,
      onUse () {Handsfree._mock.spy.onUse.push(this.name)},
      onStart () {Handsfree._mock.spy.onStart++},
      onStop () {Handsfree._mock.spy.onStop++},
      onFrame () {Handsfree._mock.spy.onFrame++}
    },
    {
      name: 'test-plugin-b',
      onUse () {Handsfree._mock.spy.onUse.push(this.name)},
      onStart () {Handsfree._mock.spy.onStart++}
    },
    {
      name: 'test-plugin-a',
      priority: -111111111111
    },
    {
      name: 'test-plugin-c',
      onStart () {Handsfree._mock.spy.onStart++},
      onStop () {Handsfree._mock.spy.onStop++},
      onFrame () {Handsfree._mock.spy.onFrame++}
    },
    {
      name: 'test-plugin-d',
      onFrame () {Handsfree._mock.spy.onFrame++}
    }
  ]

  // Use each plugin
  plugins.forEach(plugin => handsfree._use(plugin))
  Handsfree._mock.spy.onUse = Object.keys(handsfree.plugin)
}