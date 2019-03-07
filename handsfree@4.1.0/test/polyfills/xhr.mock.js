/**
 * To set these for a test, just do:
 *    global.XMLHttpRequest[propName] = newValue
 * 
 * @param {Any} status Temporarily sets the status code used on future `new XMLHttpRequest`
 */
let lastStatus = 200

global.XMLHttpRequest = function (status) {
  this.response = true
  this.open = jest.fn()
  this.send = () => {
    this.onload()
    this.onprogress({loaded: 100, total: 100})
  }

  if (status) lastStatus = this.status = status
  else this.status = lastStatus
}
