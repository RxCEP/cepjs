const path = require('path');

module.exports = {
  entry: './lib/index.js',
  mode: 'development',
  output: {
    path: path.resolve('dist'),
    filename: 'cepjs.js',
    library: 'cepjs'
  }
}