function emptySchema (schema) {
  schema.deleteMany({}, err => {
    if (err) {
      //
    }
  })
}

const server = require('../../api/server')
let serverInstance = null

function initializeServer () {
  serverInstance = new server.Server()
  serverInstance.openConnection()
  return serverInstance.getServerInstance()
}

function terminateServer (done) {
  serverInstance.closeConnection(done)
}

// Exporting functions
module.exports = {
  emptySchema: emptySchema,
  initializeServer: initializeServer,
  terminateServer: terminateServer
}
