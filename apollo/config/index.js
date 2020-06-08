require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  version: process.env.VERSION,
  tokenLife: process.env.TOKENLIFE || 2592000,
  mongooseUri: process.env.MONGOOSE_URI || '',
  mongooseCertPath: process.env.MONGOOSE_CERTPATH,
  autoIndex: true,
  loggerEnabled: process.env.LOGGERENABLED || true,
};
