window.navigator.mediaDevices = {
  getUserMedia: config => {
    return new Promise((resolve, reject) => {
      if (config) {
        resolve(config)
      } else {
        throw 'reject'
      }
    })
  }
}

HTMLMediaElement.prototype.play = jest.fn()