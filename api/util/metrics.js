const client = require('prom-client');


const flipCount = new client.Counter({
  name: 'flip_count',
  help: 'Number of flips'
});

module.exports = { flipCount };
