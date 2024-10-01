const { createClient } = require('redis');
const logger = require('../../util/logger');

class SceRedisClient {
  constructor() {
    const redisHostUrl = process.env.REDIS_HOST_URL;

    this.useRedis = !!redisHostUrl;
    this.client = new Map();

    if (redisHostUrl) {
      this.client = createClient({ url: redisHostUrl });
    }
  }

  async connect() {
    // skip connecting to redis if it's not configured
    // when we initialized the class
    if (!this.useRedis) {
      return;
    }

    try {
      await this.client.connect();
    } catch (err) {
      logger.error('Error connecting to Redis:', err);
    }
  }

  async set(key, value, options = {}) {
    return this.client.set(key, value, options);
  }

  async get(key) {
    return this.client.get(key) || null;
  }

  async delete(key) {
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
