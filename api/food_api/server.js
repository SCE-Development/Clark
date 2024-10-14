const { SceHttpServer } = require('../util/SceHttpServer');

function main() {
  const API_ENDPOINTS = [
    __dirname + '/routes/Food.js',
  ];
  const foodServer = new SceHttpServer(API_ENDPOINTS, 8084, '/food_api/');
  foodServer.initializeEndpoints().then(() => {
    foodServer.openConnection();
  });
}

main();