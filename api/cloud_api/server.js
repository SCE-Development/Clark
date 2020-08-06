const { SceHttpServer } = require('../util/SceHttpServer');

function main() {
  const API_ENDPOINTS =  __dirname + '/routes/';
  const mailerServer = new SceHttpServer(API_ENDPOINTS, 8082);
  mailerServer.initializeEndpoints().then(() => {
    mailerServer.openConnection();
  });
}

main();
