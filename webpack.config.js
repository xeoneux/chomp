var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry:'./app/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'build.js',
    publicPath: 'http://localhost:9000/dist/',
  },
  module: {
    loaders: [
        {
            test: /\.vue$/,
            loader: 'vue'
        },
        {
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules/
        }
    ]
  },
  babel: {
      "presets": ["es2015"],
      "plugins": ["transform-runtime"]
  },
  plugins: [
       new webpack.ExternalsPlugin('commonjs', [
        'electron'
       ]),
       new webpack.HotModuleReplacementPlugin()
  ]
}