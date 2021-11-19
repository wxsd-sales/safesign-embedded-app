exports.docOptions = require('./documentOptions.json');
let settings;
try {
  settings = require('./appsettings.json');
} catch (ex) {
  settings = require('./appsettingsPublic.json');
}

exports.github = require('./github.json');

settings.gatewayAccountId = process.env.DS_PAYMENT_GATEWAY_ID || settings.gatewayAccountId;
settings.dsClientSecret = process.env.DS_CLIENT_SECRET || settings.dsClientSecret;
settings.signerEmail = process.env.DS_SIGNER_EMAIL || settings.signerEmail;
settings.signerName = process.env.DS_SIGNER_NAME || settings.signerName;
settings.dsClientId = process.env.DS_CLIENT_ID || settings.dsClientId;
settings.appUrl = process.env.DS_APP_URL || settings.appUrl;
settings.dsJWTClientId = process.env.DS_JWT_CLIENT_ID || settings.dsJWTClientId;
settings.privateKeyLocation = process.env.DS_PRIVATE_KEY_PATH  || settings.privateKeyLocation;
settings.impersonatedUserGuid =  process.env.DS_IMPERSONATED_USER_GUID || settings.impersonatedUserGuid;
settings.targetAccountId = process.env.TARGET_ACCOUNT_ID || settings.targetAccountId;
settings.sessionSecret = process.env.SESSION_SECRET || settings.sessionSecret;
settings.production = process.env.PRODUCTION || settings.production;
settings.privateKey = process.env.PRIVATE_KEY || settings.privateKey;
settings.mongodbPassword = process.env.MONGODB_PASSWORD || settings.mongodbPassword;
settings.adminPassword = process.env.ADMIN_PASSWORD || settings.adminPassword;

// const dsOauthServer = settings.production
//   ? 'https://account.docusign.com'
//   : 'https://account-d.docusign.com';
const dsOauthServer = 'https://account-d.docusign.com'

exports.config = {
  dsOauthServer,
  ...settings
};
