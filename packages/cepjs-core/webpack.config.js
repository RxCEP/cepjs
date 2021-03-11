const path = require('path');

let config = {
  entry: './lib',
  mode: 'production',
  output: {
    path: path.resolve('dist'),
    filename: 'cepjsCore.min.js',
    library: 'cepjsCore'
  }
};

const es5Config = {
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
};

module.exports = env => {

  if (env.dev) {
    config.mode = 'development';
    config.output.filename = 'cepjsCore.js';
  }

  if (env.es5) {
    config.output.path = path.resolve('dist.es5');
    config.module = es5Config;
  }

  return config;
}