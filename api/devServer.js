// This if statement checks if the module was require()'d or if it was run
// by node server.js. If we are not requiring it and are running it from the
// command line, we create a server instance and start listening for requests.
if (typeof module !== 'undefined' && !module.parent) {
  // Starting servers
  require('./main_endpoints/server');
  require('./cloud_api/server');
  require('./dessert_api/server');
}
