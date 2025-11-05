const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  module: {
    rules: [
      { test: /\.css$/i, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),
    new InjectManifest({
      swSrc: path.resolve(__dirname, 'src/scripts/sw.js'),  
      swDest: 'sw.bundle.js',                              
    }),
  ],
  optimization: { splitChunks: { chunks: 'all' } },
});
