const { model } = require('mongoose');
const { SceHttpServer } = require('../util/SceHttpServer');

function main() {
  const API_ENDPOINTS =  __dirname + '/routes/';
  const cloudServer = new SceHttpServer(API_ENDPOINTS, 8082, '/cloudapi/');
  cloudServer.initializeEndpoints().then(() => {
    cloudServer.openConnection();
  });
}

main();
