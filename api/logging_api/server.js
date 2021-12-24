const { SceHttpServer } = require('../util/SceHttpServer');

function main() {
  const API_ENDPOINTS = [
    __dirname + '/routes/ErrorLog.js',
    __dirname + '/routes/PrintLog.js',
    __dirname + '/routes/SignLog.js',
    __dirname + '/routes/LedSign.js',
    __dirname + '/routes/Printer.js'

  ];
  const loggingServer = new SceHttpServer(API_ENDPOINTS, 8081, '/logging_api/');
  loggingServer.initializeEndpoints().then(() => {
    loggingServer.openConnection();
  });
}

main();