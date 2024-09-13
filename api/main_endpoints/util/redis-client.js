const { createClient } = require('redis');
const logger = require('../../util/logger');

class MockRedisClient {
  constructor() {
    this.store = new Map();
  }

  async connect() {
  }

  async set(key, value, options = {}) {
    this.store.set(key, value);
    return true;
  }

  async get(key) {
    return this.store.get(key) || null;
  }

  async del(key) {
    return this.store.delete(key) ? true : false;
  }
}

const redisHost = process.env.REDIS_HOST;

const client = redisHost
  ? createClient({ url: `redis://${redisHost}:6379` })
  : new MockRedisClient();

(async () => {
  try {
    await client.connect();
  } catch (err) {
    logger.error('Error connecting to Redis:', err);
  }
})();

module.exports = client;
