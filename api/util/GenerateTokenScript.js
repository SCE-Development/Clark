const { AuthManager } = require('../cloud_api/util/AuthManager');
const { SceGoogleApiHandler } =
  require('../cloud_api/util/SceGoogleApiHandler');

const authManager = new AuthManager();
const configPath = __dirname + '/../config/config.json';
authManager.setAuthCredentials(configPath, () => {
  const scopes = [
    'https://mail.google.com/',
    'https://www.googleapis.com/auth/calendar'
  ];
  const tokenPath = __dirname + '/../config/token.json';
  const apiHandler = new SceGoogleApiHandler(
    scopes,
    tokenPath,
  );

  if (apiHandler) {
    apiHandler.getNewToken(true);
  }
});
