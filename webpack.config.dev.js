const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const fs = require("fs");

// Make cert for https
// - mkcert -install
// - mkcert localhost 127.0.0.1

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    liveReload: true,
    hot: true,
    open: true,
    static: ['./'],
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    },
    server: {
      type: 'https',
      options: {
        key: fs.readFileSync('./localhost+1-key.pem'),
        cert: fs.readFileSync('./localhost+1.pem')
      }
    }
  },
});
