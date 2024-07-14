const client = require('prom-client');

const register = new client.Registry();
class MetricsHandler {

	endpointHits = new client.Counter({
	  name: 'endpoint_hits',
	  help: 'Counter for tracking endpoint hits with status codes',
	  labelNames: ['method', 'route', 'statusCode'],
	})

	constructor() {
	  register.setDefaultLabels({
	    app: 'sce-core',
	  });
	  client.collectDefaultMetrics({ register });

	  Object.keys(this).forEach((metric) => {
	    register.registerMetric(this[metric]);
	  });
	}
}

module.exports = {
  metrics: new MetricsHandler(),
  register,
};
