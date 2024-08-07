const { SceHttpServer } = require('../../../api/util/SceHttpServer');

let serverInstance = null;

function emptySchema(schema) {
  schema.deleteMany({}, err => {
    if (err) {
      //
    }
  });
}

function insertItem(schema, item) {
  schema.create(item, (err) => {
    if(err) {
      //
    }
  });
}

function initializeServer(path, port = 7999) {
  serverInstance = new SceHttpServer(path, port);
  serverInstance.init();
  serverInstance.openConnection();
  return serverInstance.getServerInstance();
}

function terminateServer(done) {
  serverInstance.closeConnection(done);
}

// Exporting functions
module.exports = {
  emptySchema,
  insertItem,
  initializeServer,
  terminateServer
};
