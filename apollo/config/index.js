require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  version: process.env.VERSION,
  tokenLife: process.env.TOKENLIFE || 2592000,
  mongooseUri: process.env.MONGOOSE_URI || '',
  mongooseCertPath: process.env.MONGOOSE_CERTPATH,
  autoIndex: true,
  loggerEnabled: process.env.LOGGERENABLED || true,
  jwtSecret: process.env.JWT_SECRET,
  refreshSecret: process.env.JWT_SECRET,
  privateKeyFile: process.env.PRIVATE_KEY_FILE || '',
  refreshTokenName: process.env.REFRESH_TOKEN_NAME,
  allowedOrigin: process.env.ALLOWED_ORIGIN,
};
