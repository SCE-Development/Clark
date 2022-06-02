const User = require('../models/User');
const axios = require('axios');
const {
  discordApiKeys
} = require('../../config/config.json');

async function loginWithDiscord(code, email, discordRedirectUri) {
  return new Promise((resolve, reject) => {
    if(discordApiKeys.CLIENT_ID == 'NOT_SET'
    && discordApiKeys.CLIENT_SECRET == 'NOT_SET') {
      return resolve(true);
    }
    axios
      .post('https://discord.com/api/oauth2/token',
        `&client_id=${discordApiKeys.CLIENT_ID}` +
        `&client_secret=${discordApiKeys.CLIENT_SECRET}` +
        `&grant_type=authorization_code&code=${code}` +
        `&redirect_uri=${encodeURIComponent(discordRedirectUri)}`)
      .then(response => {
        axios.get('https://discord.com/api/users/@me', {
          headers: {
            Authorization: `Bearer ${response.data.access_token}`,
          }
        })
          .then(loginResponse => {
            User.findOne({ email })
              .then((user) => {
                const { username, discriminator, id } = loginResponse.data;
                user.discordUsername = username;
                user.discordDiscrim = discriminator;
                user.discordID = id;
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
