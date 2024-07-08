const { client, register } = require('../util/metrics');
const express = require('express');
const router = express.Router();


client.collectDefaultMetrics({ register });

/**
 * @GET /api/Metrics
 * @Returns the metrics for the Prometheus server
 */
router.get('/', async (_, res) => {
	res.setHeader('Content-Type', register.contentType);
	res.end(await register.metrics());
})

module.exports = router;
