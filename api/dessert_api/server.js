const { SceHttpServer } = require('../util/SceHttpServer');

function main() {
  const API_ENDPOINTS = [
    __dirname + '/routes/Dessert.js',
  ];
  const dessertServer = new SceHttpServer(API_ENDPOINTS, 8084, '/dessert_api/');
  dessertServer.initializeEndpoints().then(() => {
    dessertServer.openConnection();
  });
}

main();
