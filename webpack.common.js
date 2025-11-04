const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/scripts/index.js'),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // auto bersihkan dist setiap build
  },
  module: {
    rules: [
      { test: /\.(png|jpe?g|gif|svg)$/i, type: 'asset/resource' },
      { test: /\.css$/i, use: ['style-loader', 'css-loader'] },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader', options: { presets: [['@babel/preset-env',{targets:'defaults'}]] } },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      filename: 'index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: path.resolve(__dirname, 'src/public/'), to: path.resolve(__dirname, 'dist/') }],
    }),
    new WorkboxWebpackPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/story-api\.dicoding\.dev\/v1\//,
          handler: 'NetworkFirst',
          options: { cacheName: 'story-api-cache' },
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
          handler: 'CacheFirst',
          options: { cacheName: 'image-cache', expiration: { maxEntries: 50, maxAgeSeconds: 30*24*60*60 } },
        },
      ],
    }),
  ],
};
