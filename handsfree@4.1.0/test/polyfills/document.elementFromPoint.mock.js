/**
 * Make sure document.elementFromPoint returns something
 */
Object.defineProperty(document, 'elementFromPoint', {
  value: function () { return {} }
})