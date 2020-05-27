const { SceHttpServer } = require('../../api/SceHttpServer');

let serverInstance = null;

function emptySchema(schema) {
  schema.deleteMany({}, err => {
    if (err) {
      //
    }
  });
}

function initializeServer(path, port = 7999) {
  serverInstance = new SceHttpServer(path, port);
  serverInstance.initializeEndpoints();
  serverInstance.openConnection();
  return serverInstance.getServerInstance();
}

function terminateServer(done) {
  serverInstance.closeConnection(done);
}

// Exporting functions
module.exports = {
  emptySchema,
  initializeServer,
  terminateServer
};
