
const client = require('prom-client');
let register = new client.Registry();
register.setDefaultLabels({
	  app: 'sce-core',
});

const express = require('express');
const router = express.Router();


client.collectDefaultMetrics({ register });

/**
 * @GET /api/Metrics
 * @Returns the metrics for the Prometheus server
 */
router.get('/metrics', async (_, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.end(await register.metrics());
});

module.exports = {
  register,
  client,
  router,
};
