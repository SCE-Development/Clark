const User = require('../models/User');
const axios = require('axios');
const {
  discordApiKeys
} = require('../../config/config.json');

async function loginWithDiscord(code, email) {
  return new Promise((resolve, reject) => {
    axios
      .post('https://discord.com/api/oauth2/token',
        `&client_id=${discordApiKeys.CLIENT_ID}` +
        `&client_secret=${discordApiKeys.CLIENT_SECRET}` +
        `&grant_type=authorization_code&code=${code}` +
        `&redirect_uri=${discordApiKeys.REDIRECT_URI}`)
      .then(response => {
        axios.get('https://discord.com/api/users/@me', {
          headers: {
            Authorization: `Bearer ${response.data.access_token}`,
          }
        })
          .then(loginResponse => {
            User.findOne({ email })
              .then((user) => {
                user.discordUsername = loginResponse.data.username;
                user.discordDiscrim = loginResponse.data.discriminator;
                user.discordID = loginResponse.data.id;
                user.save();
                resolve(true);
              });
          })
          .catch(() => {
            reject(false);
          });
      })
      .catch(() => {
        reject(false);
      });
  });
}

module.exports = {
  loginWithDiscord
};
