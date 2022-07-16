const { SceHttpServer } = require('../util/SceHttpServer');

function main() {
  const API_ENDPOINTS = [
    __dirname + '/routes/'
  ];
  const mainEndpointServer =  new SceHttpServer(API_ENDPOINTS, 8080);
  mainEndpointServer.initializeEndpoints().then(() => {
    mainEndpointServer.openConnection();
  });
}

main();
