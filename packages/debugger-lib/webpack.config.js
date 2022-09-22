const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const resolve = (p) => path.resolve(__dirname, p);

module.exports = {
  mode: 'development',
  entry: resolve('./src/index.ts'),
  output: {
    filename: 'bundle.js',
    path: resolve('dist'),
  },
  devtool: 'source-map',
  devServer: {
    port: 3001,
  },
  module: {
    rules: [
      {
        test: /(ts|jsx)$/i,
        use: 'babel-loader?cacheDirectory',
      },
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: resolve('./index.html'),
      inject: 'head',
      minify: true,
    }),
  ],
};
