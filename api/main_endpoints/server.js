const { SceHttpServer } = require('../util/SceHttpServer');

function main() {
  const API_ENDPOINTS = [
    __dirname + '/routes/'
  ];
  // eslint-disable-next-line max-len
  const mainEndpointServer =
  new SceHttpServer(API_ENDPOINTS, 8080, '/mainendpoints/');
  mainEndpointServer.initializeEndpoints().then(() => {
    mainEndpointServer.openConnection();
  });
}

main();
