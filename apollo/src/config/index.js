require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3000,
  version: process.env.VERSION,
  tokenLife: process.env.TOKENLIFE || 2592000,
  orgDomain: process.env.ORG_DOMAIN,
  mongooseUri: process.env.MONGOOSE_URI || "",
  // mongooseCertPath: process.env.MONGOOSE_CERTPATH,
  autoIndex: true,
  loggerEnabled: process.env.LOGGERENABLED || true,
  modeOrg: process.env.MODE_ANALYTICS_ORGANIZATION,
  modeKey: process.env.MODE_ANALYTICS_API_KEY,
  modeSecret: process.env.MODE_ANALYTICS_API_SECRET,
  modeEmbedKey: process.env.MODE_ANALYTICS_ACCESS_KEY,
  modeEmbedSecret: process.env.MODE_ANALYTICS_ACCESS_SECRET,
  modeReportId: process.env.MODE_ANALYTICS_REPORT_ID,
  modeMaxAge: process.env.MODE_ANALYTICS_MAX_AGE, // the most frequent ingestions are typically per hour
  jwtSecret: process.env.JWT_SECRET,
  refreshSecret: process.env.JWT_SECRET,
  privateKeyFile: process.env.PRIVATE_KEY_FILE || "",
  refreshTokenName: process.env.REFRESH_TOKEN_NAME,
  allowedOrigin: process.env.ALLOWED_ORIGIN,
  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackUrl: process.env.GITHUB_CALLBACK_URL,
    appId: process.env.GITHUB_APP_ID,
    privateKey: process.env.GITHUB_PRIVATE_KEY,
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY,
    defaultSender: process.env.SENDGRID_DEFAULT_SENDER,
  },
};
