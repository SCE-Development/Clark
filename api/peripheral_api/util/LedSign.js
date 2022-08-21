const axios = require('axios');
const logger = require('../../util/logger');

async function updateSign(data) {
  return new Promise((resolve) => {
    axios
      .post('http://host.docker.internal:11000/api/update-sign' + {...data})
      .then(() => {
        resolve(true);
      }).catch((err) => {
        logger.error('updateSign had an error: ', e);
        resolve(false);
      });
  });
}
async function healthCheck() {
  return new Promise((resolve) => {
    axios
      .get('http://host.docker.internal:11000/api/health-check')
      .then(() => {
        resolve(true);
      }).catch((err) => {
        logger.error('healthCheck had an error: ', e);
        resolve(false);
      });
  });
}

module.exports = { updateSign, healthCheck };
