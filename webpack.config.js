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
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-proposal-object-rest-spread']
            }
          }
        }
      ]
    }
  }
}