const { SceHttpServer } = require('../util/SceHttpServer');

//defines server class
/* imports the handlers from routes and attach
them to a server listening on a specified port
*/

function main() {
  const API_ENDPOINTS = [
    __dirname + '/routes/Dessert.js',
  ];
  const dessertServer = new SceHttpServer(API_ENDPOINTS, 8084, '/dessert_api/');
  dessertServer.initializeEndpoints().then(() => {
    dessertServer.openConnection();
  });
}
/* 3 params sent to SceHttpServer
API_ENDPOINTS points to where we defined our request handlers
8084 is the port we want to listen
/dessert_api/ is the base of our request endpoints.
This server takes those parameters and generates request URLs 
*/

main();
