const path = require('path');

const config = {
  entry: './lib',
  mode: 'production',
  output: {
    path: path.resolve('dist'),
    filename: 'cep_most.min.js',
    library: 'cepjsMost'
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
};

module.exports = (env, argv) => {
  
  if(argv.mode === 'development'){
    config.mode = argv.mode;
    config.output.filename = 'cep_most.js';
  }
  
  return config;
}