const CopyPlugin = require('copy-webpack-plugin')
const HtmlPlugin = require('html-webpack-plugin')

const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'development',
  entry: {
    popup: path.resolve('src/popup/popup.tsx'),
    content: path.resolve('src/content.js'),
    background: path.resolve('src/background.js'),
  },
  module: {
    rules: [
      {
        test: /\.tsx$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve('src/assets/manifest.json'),
          to: path.resolve('dist'),
        },
        { from: path.resolve('src/assets/icon.png'), to: path.resolve('dist') },
      ],
    }),
    new HtmlPlugin({
      title: 'React Js Extension',
      filename: 'popup.html',
      chunks: ['popup'],
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
  },
  devtool: 'cheap-module-source-map',
}
