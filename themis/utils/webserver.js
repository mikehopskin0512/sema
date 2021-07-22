// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';
process.env.ASSET_PATH = '/';

var WebpackDevServer = require('webpack-dev-server'),
  webpack = require('webpack'),
  config = require('../webpack.config'),
  env = require('./env'),
  path = require('path');

const fs = require('fs');

const { exec } = require('child_process');

var options = config.chromeExtensionBoilerplate || {};
var excludeEntriesToHotReload = options.notHotReload || [];

const scssDirPath = path.resolve('src/pages/Content/styles');
const scssFiles = fs
  .readdirSync(scssDirPath)
  .map((fileName) => `${scssDirPath}/${fileName}`);

config.entry.scss = scssFiles;

for (var entryName in config.entry) {
  if (excludeEntriesToHotReload.indexOf(entryName) === -1) {
    config.entry[entryName] = [
      'webpack-dev-server/client?http://localhost:' + env.PORT,
      'webpack/hot/dev-server',
    ].concat(config.entry[entryName]);
  }
}

config.plugins = [new webpack.HotModuleReplacementPlugin()].concat(
  config.plugins || []
);

delete config.chromeExtensionBoilerplate;

var compiler = webpack(config);
compiler.hooks.afterEmit.intercept({
  call: (...args) => {
    exec('npm run compile-scss', (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log('SCSS compiled');
    });
  },
});

var server = new WebpackDevServer(compiler, {
  https: false,
  hot: true,
  injectClient: false,
  writeToDisk: true,
  port: env.PORT,
  contentBase: path.join(__dirname, '../build'),
  publicPath: `http://localhost:${env.PORT}`,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  disableHostCheck: true,
});

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept();
}

server.listen(env.PORT);
