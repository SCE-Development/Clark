const { SceHttpServer } = require('../util/SceHttpServer');

function main() {
  const API_ENDPOINTS = [__dirname + '/routes/RFID.js'];

  const RFIDServer = new SceHttpServer(API_ENDPOINTS, 8085, '/RFID_api/');
  RFIDServer.initializeEndpoints().then(() => {
    RFIDServer.openConnection();
  });
}

main();
