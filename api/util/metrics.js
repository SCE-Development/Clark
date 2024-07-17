const client = require('prom-client');

const register = new client.Registry();
class MetricsHandler {
	endpointHits = new client.Counter({
	  name: 'endpoint_hits',
	  help: 'Counter for tracking endpoint hits with status codes',
	  labelNames: ['method', 'route', 'statusCode'],
	});

	emailSent = new client.Counter({
	  name: 'email_sent',
	  help: 'Counter for tracking emails sent',
	  labelNames: ['type'],
	});

	captchaVerificationErrors = new client.Counter({
	  name: 'captcha_verification_errors',
	  help: 'Counter for tracking captcha verification errors',
	});

	sshTunnelErrors = new client.Counter({
	  name: 'ssh_tunnel_errors',
	  help: 'Counter for tracking ssh tunnel errors',
	  labelNames: ['type'],
	});

	constructor() {
	  register.setDefaultLabels({
	    app: 'sce-core',
	  });
	  client.collectDefaultMetrics({ register });

	  Object.keys(this).forEach(metric => {
	    register.registerMetric(this[metric]);
	  });
	}
}

module.exports = {
  metrics: new MetricsHandler(),
  register,
};
