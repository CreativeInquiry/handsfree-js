const pckg = require('../../package')

const $script = document.createElement('script')
$script.setAttribute('src', pckg.jest.testURL)

Object.defineProperty(document, 'currentScript', {
  value: $script
})