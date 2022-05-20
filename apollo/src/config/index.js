const path = require('path');

const isTest = process.env.NODE_ENV === 'test';
const configPath = isTest ? path.resolve(__dirname, '../../.env.test') : '.env';
const jestWorkerID = parseInt(process.env.JEST_WORKER_ID || 0, 10);

require('dotenv').config({ path: configPath });

module.exports = {
  ...getMongoDBConnectionDetails(),
  port: getPort(),
  version: process.env.VERSION,
  tokenLife: process.env.TOKENLIFE || 2592000,
  orgDomain: process.env.ORG_DOMAIN,
  rootDomain: process.env.ROOT_DOMAIN,
  autoIndex: true,
  loggerEnabled: process.env.LOGGERENABLED !== '0',
  modeOrg: process.env.MODE_ANALYTICS_ORGANIZATION,
  modeKey: process.env.MODE_ANALYTICS_API_KEY,
  modeSecret: process.env.MODE_ANALYTICS_API_SECRET,
  modeEmbedKey: process.env.MODE_ANALYTICS_ACCESS_KEY,
  modeEmbedSecret: process.env.MODE_ANALYTICS_ACCESS_SECRET,
  modeReportId: process.env.MODE_ANALYTICS_REPORT_ID,
  modeMaxAge: process.env.MODE_ANALYTICS_MAX_AGE, // the most frequent ingestions are typically per hour
  jwtSecret: process.env.JWT_SECRET,
  refreshSecret: process.env.JWT_SECRET,
  privateKeyFile: process.env.PRIVATE_KEY_FILE || '',
  refreshTokenName: process.env.REFRESH_TOKEN_NAME,
  refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION,
  allowedOrigin: process.env.ALLOWED_ORIGIN,
  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackUrl: process.env.GITHUB_CALLBACK_URL,
    appId: process.env.GITHUB_APP_ID,
    privateKey: process.env.GITHUB_PRIVATE_KEY.replace(/\\n/gm, '\n'),
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY,
    defaultSender: process.env.SENDGRID_DEFAULT_SENDER,
  },
  pgPublicKey: process.env.PG_PUBLIC_KEY,
  userVoiceKey: process.env.USER_VOICE_SECRET_KEY,
  intercomToken: process.env.INTERCOM_TOKEN || null,
  mailchimpServerPrefix: process.env.MAILCHIMP_SERVER_PREFIX || null,
  mailchimpToken: process.env.MAILCHIMP_TOKEN || null,
  mailchimpAudiences: {
    registeredAndWaitlistUsers:
      process.env.MAILCHIMP_REGISTERED_AND_WAITLIST_USERS_AUDIENCE_ID || null,
  },
  chromeExtensionId: process.env.CHROME_EXTENSION_ID,
  iframelyApiKey: process.env.IFRAMELY_API_KEY,
  semaCorporateTeamName: process.env.SEMA_CORPORATE_TEAM_NAME,
  semaCorporateTeamId: process.env.SEMA_CORPORATE_TEAM_ID,
  environment: process.env.ENV || 'unknown',
  jaxon: {
    summariesApi:
      process.env.JAXON_SUMMARIES_API ||
      'https://hephaestus-summaries.semasoftware.com',
    tagsApi:
      process.env.JAXON_TAGS_API || 'https://hephaestus-tags.semasoftware.com',
  },
};

function getPort() {
  const port = parseInt(process.env.PORT || 3000, 10);
  if (isTest) return port + jestWorkerID;
  return port;
}

function getMongoDBConnectionDetails() {
  const uri = new URL(process.env.MONGOOSE_URI);
  const [, databaseNameFromURI] = uri.pathname.split('/');
  const databaseName = isTest
    ? `${databaseNameFromURI}-${jestWorkerID}`
    : databaseNameFromURI;

  uri.pathname = databaseName;
  return {
    mongooseUri: uri.toString(),
    databaseName,
  };
}
