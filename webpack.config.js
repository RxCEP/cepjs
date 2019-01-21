const path = require('path');

module.exports = (env, argv) => { 
  const mode = argv.mode || 'production';
  return {
    entry: './lib',
    mode: mode,
    output: {
      path: path.resolve('dist'),
      filename: 'cep.js',
      library: 'cepjs'
    }
  }
}