// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';
process.env.ASSET_PATH = '/';

const { exec } = require('child_process');

var webpack = require('webpack'),
  config = require('../webpack.config');

delete config.chromeExtensionBoilerplate;

config.mode = 'production';

const compiler = webpack(config, function (err, stats) {
  if (err) throw err;
  if (stats.errors?.length) {
    console.log(stats.errors);
    process.exit(1);
  }
});

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
