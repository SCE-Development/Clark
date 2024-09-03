const { createClient } = require('redis');
const logger = require('../../util/logger');

const client = createClient({
  url: 'redis://redis:6379'
});

(async () => {
  try {
    await client.connect();
  } catch (err) {
    logger.error('Error connecting to Redis:', err);
  }
})();

module.exports = client;
