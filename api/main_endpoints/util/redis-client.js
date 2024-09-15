const { createClient } = require('redis');
const logger = require('../../util/logger');

class SceRedisClient {
  constructor() {
    const redisHostUrl = process.env.REDIS_HOST_URL;

    if (redisHostUrl) {
      this.client = createClient({ url: redisHostUrl });
      this.useRedis = true;
    } else {
      this.client = new Map();
      this.useRedis = false;
    }
  }

  async connect() {
    if (this.useRedis) {
      try {
        await this.client.connect();
      } catch (err) {
        logger.error('Error connecting to Redis:', err);
      }
    }
  }

  async set(key, value, options = {}) {
    return this.client.set(key, value, options);
  }

  async get(key) {
    return this.client.get(key) || null;
  }

  async del(key) {
    if (this.useRedis) {
      return this.client.del(key);
    } else {
      return this.client.delete(key) ? true : false;
    }
  }
}

const client = new SceRedisClient();
client.connect();

module.exports = client;
