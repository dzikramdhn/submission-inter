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
    clean: true, 
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: 'defaults' }]],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      filename: 'index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/scripts/'),
          to: path.resolve(__dirname, 'dist/'),
        },
      ],
    }),
   
    new WorkboxWebpackPlugin.InjectManifest({
      swSrc: path.resolve(__dirname, 'src/scripts/sw.js'), 
      swDest: 'service-worker.js',                        
      maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,     
    }),
  ],
};
