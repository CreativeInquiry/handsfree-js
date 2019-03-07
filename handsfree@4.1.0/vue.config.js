const path = require('path')

module.exports = {
  productionSourceMap: false,
  
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.frag$/,
          use: [
            {
              loader: 'raw-loader'
            }
          ]
        }
      ]
    },
    
    entry: {
      handsfree: ['idempotent-babel-polyfill', path.join(__dirname, 'handsfree.js/Handsfree.js')]
    },

    output: {
      path: path.join(__dirname, 'dist'),
      filename: `[name].js`,
      library: 'Handsfree',
      libraryTarget: 'umd'
    }
  }
}