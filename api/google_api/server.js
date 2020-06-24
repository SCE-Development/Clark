const { SceHttpServer } = require('../util/SceHttpServer');

function main() {
  const API_ENDPOINTS = [
    __dirname + '/routes/calendar.js',
    __dirname + '/routes/mailer.js'
  ];
  const mailerServer = new SceHttpServer(API_ENDPOINTS, 8082);
  mailerServer.initializeEndpoints().then(() => {
    mailerServer.openConnection();
  });
}

main();
