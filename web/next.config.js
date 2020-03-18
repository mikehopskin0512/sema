const dotEnvResult = require('dotenv').config();
const withCSS = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');

const parsedVariables = dotEnvResult.parsed || {};
const dotEnvVariables = {};
for (const key of Object.keys(parsedVariables)) {
  dotEnvVariables[key] = process.env[key];
}
module.exports = {
  env: {
    ...dotEnvVariables,
  },
  ...withSass(withCSS()),
};
