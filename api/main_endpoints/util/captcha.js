const axios = require('axios');

const logger = require('../../util/logger');
const config = require('../../config/config.json');

async function verifyCaptcha(responseToken) {
  const secretKey = config.googleApiKeys.SECRET_KEY;

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${responseToken}`,
    );
    return { success: response.data.success };
  } catch (error) {
    logger.error('Error verifying captcha:', error);
    return { success: false };
  }
}

module.exports = {
  verifyCaptcha
};
