const path = require('path');

module.exports = {
  entry: './lib',
  mode: 'production',
  output: {
    path: path.resolve('dist'),
    filename: 'cepjs.js',
    library: 'cepjs'
  }
}