const axios = require('axios');

const config = require('../../../config/config.json');

async function verifyCaptcha(responseToken) {
  const secretKey = config.googleApiKeys.SECRET_KEY;

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${responseToken}`,
    );
    return { success: response.data.success };
  } catch (error) {
    return { error };
  }
}

module.exports = {
  verifyCaptcha
};
