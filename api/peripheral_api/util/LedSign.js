const axios = require('axios');

async function updateSign(req) {
  return new Promise((resolve) => {
    try {
      axios
        .post('http://host.docker.internal:11000/api/update-sign' + {req})
        .then(() => {
          resolve(true);
        }).catch((err) => {
          resolve(false);
        });
    } catch (e) {
      resolve(false);
    }
  });
}
async function healthCheck() {
  return new Promise((resolve) => {
    try {
      axios
        .get('http://host.docker.internal:11000/api/health-check')
        .then(() => {
          resolve(true);
        }).catch((err) => {
          resolve(false);
        });
    } catch (e) {
      resolve(false);
    }
  });
}

module.exports = { updateSign, healthCheck };
