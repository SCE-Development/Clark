
const client = require('prom-client');
let register = new client.Registry();
register.setDefaultLabels({
	  app: 'sce-core',
});

module.exports = {
	register,
	client,
}
