const { SceHttpServer } = require('../util/SceHttpServer');
const logger = require('../util/logger');

function main() {
  try {
    logger.info('Starting server...');
    const API_ENDPOINTS = [
      __dirname + '/routes/LedSign.js',
      __dirname + '/routes/Printer.js',
      __dirname + '/routes/RFID.js'
    ];
    const peripheralServer = new
    SceHttpServer(API_ENDPOINTS, 8081, '/peripheralapi/');
    peripheralServer.initializeEndpoints().then(() => {
      peripheralServer.openConnection();
    });
    logger.info('Server started');
  } catch (e) {
    logger.error('Error starting peripheral API: ', e);
  }
}

main();
