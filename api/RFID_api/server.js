const { SceHttpServer } = require('../util/SceHttpServer');

function main() {
  const API_ENDPOINTS = [__dirname + '/routes/RFID.js'];

  const dessertServer = new SceHttpServer(API_ENDPOINTS, 8085, '/RFID_api/');
  dessertServer.initializeEndpoints().then(() => {
    dessertServer.openConnection();
  });
}

main();
