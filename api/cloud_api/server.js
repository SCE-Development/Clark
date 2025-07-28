const { model } = require('mongoose');
const { SceHttpServer } = require('../util/SceHttpServer');

function main() {
  const API_ENDPOINTS =  [__dirname + '/routes/'];
  const mainEndpointServer  = new SceHttpServer(API_ENDPOINTS, 8082, '/cloudapi/');
  mainEndpointServer.init().then(() => {
    mainEndpointServer.openConnection();
  });
}

main();
