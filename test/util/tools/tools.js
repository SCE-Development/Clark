const { SceHttpServer } = require('../../../api/util/SceHttpServer');
const fs = require('fs');
const path = require('path');

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

function createFakeChunk(dir, name, mtime) {
  const filePath = path.join(dir, name);
  fs.writeFileSync(filePath, '');
  fs.utimesSync(filePath, 0, mtime, () => {});
  return filePath;
}

// Exporting functions
module.exports = {
  emptySchema,
  insertItem,
  initializeServer,
  terminateServer,
  createFakeChunk
};
