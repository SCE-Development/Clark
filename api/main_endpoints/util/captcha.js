const axios = require('axios');

const logger = require('../../util/logger');
const config = require('../../config/config.json');

async function verifyCaptcha(responseToken) {
  if (!responseToken) {
    return { success: false };
  }
  
  const secretKey = config.googleApiKeys.CAPTCHA_SECRET_KEY;

  try {
    const url = new URL('https://www.google.com/recaptcha/api/siteverify');
    url.searchParams.append('secret', secretKey);
    url.searchParams.append('response', responseToken);
    const response = await axios.post(url.href);
    return { success: response.data.success };
  } catch (error) {
    logger.error('Error verifying captcha:', error);
    return { success: false };
  }
}

module.exports = {
  verifyCaptcha
};
