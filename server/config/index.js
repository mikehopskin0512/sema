const nodeEnv = process.env.NODE_ENV || 'development';
const development = require('./development');
const staging = require('./staging');
const production = require('./production');

const config = {
  development,
  staging,
  production,
};

module.exports = config[nodeEnv];
