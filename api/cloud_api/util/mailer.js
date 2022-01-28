const { SceGoogleApiHandler } = require('../util/SceGoogleApiHandler');
const {
  generateResetPasswordTemplate
} = require('../email_templates/reset-password');

async function sendResetEmail(recipient, resetLink) {
  const scopes = ['https://mail.google.com/'];
  const pathToToken = __dirname + '/../../config/token.json';
  const googleApiHandler = new SceGoogleApiHandler(scopes, pathToToken);
  const googleApiToken = await googleApiHandler.checkIfTokenFileExists();
  if (googleApiToken) {
    if (googleApiHandler.checkIfTokenIsExpired(googleApiToken)) {
      googleApiHandler.refreshToken();
    }
  } else {
    googleApiHandler.getNewToken();
  }

  const template = generateResetPasswordTemplate(recipient, resetLink);
  try {
    await googleApiHandler.sendEmail(template);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

module.exports = { sendResetEmail };
