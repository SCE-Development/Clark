const express = require('express');
const bodyParser = require('body-parser')
const settings = require('./util/settings')
const cors = require('cors');
const http = require('http')
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const { PathParser } = require('./util/PathParser');

/**
 * Class responsible for resolving paths of API endpoints and combining them
 * them into an express server.
 */
class SceHttpServer {
  /**
   * Store port information, create express server object and configure
   * BodyParser options.
   * @param {(String|Array<String>)} pathToEndpoints The path to a single
   * server file, directory or array of directories/files;
   * @param {Number} port The port for the server to listen on.
   * @param {String} prefix The prefix of the api endpoints to send requests
   * to, e.g. /api/Event/addEvent, with /api/ being the prefix.
   */
  constructor(pathToEndpoints, port, prefix = '/api/') {
    const testEnv = process.env.NODE_ENV === 'test';
    this.runningInProduction = process.env.NODE_ENV === 'production';
    this.database = testEnv ? 'sce_core_test' : 'sce_core';
    this.port = port;
    this.pathToEndpoints = pathToEndpoints;
    this.prefix = prefix;
    this.app = express();
    this.app.locals.title = 'Core v4';
    this.app.locals.email = 'test@test.com';

    this.app.use(cors());
    this.app.use(
      bodyParser.json({
        // support JSON-encoded request bodies
        limit: '50mb',
        strict: true
      })
    );
    this.app.use(
      bodyParser.urlencoded({
        // support URL-encoded request bodies
        limit: '50mb',
        extended: true
      })
    );
    this.app.use(express.static(settings.root));
  }

  /**
   * This function is responsible for taking the pathToEndpoints instance
   * variable and resolving API endpoints from it.
   */
  async initializeEndpoints() {
    const requireList = await PathParser.parsePath(this.pathToEndpoints);
    requireList.map(route => {
      this.app.use(this.prefix + route.endpointName, require(route.filePath));
    });
  }

  /**
   * Create the http server, connect to MongoDB and start listening on
   * the supplied port.
   */
  openConnection() {
    this.server = http.createServer(this.app);
    this.connectToMongoDb();
    const { port } = this;
    this.server.listen(port, function () {
      console.debug(`Now listening on port ${port}`);
    })
  }

  /**
   * Initialize a connection to MongoDB.
   */
  connectToMongoDb() {
    this.mongoose = mongoose
    this.mongoose
      .connect(`mongodb://localhost/${this.database}`, {
        promiseLibrary: require('bluebird'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      })
      .then(() => {
        console.log('MongoDB Connection Successful')
        console.log()
      })
      .catch(error => console.error(error))
  }

  /**
   * Return the current instance of the HTTP server. This function is useful
   * for making chai HTTP requests in our API testing files.
   * @returns {http.Server} The current instance of the HTTP server.
   */
  getServerInstance() {
    return this.server;
  }

  /**
   * Close the connection to MongoDB and stop the server.
   * @param {Function|null} done A function supplied by mocha as a callback to
   * signify that we have completed stopping the server.
   */
  closeConnection(done = null) {
    this.server.close();
    this.mongoose.connection.close(done);
  }
}

// This if statement checks if the module was require()'d or if it was run
// by node server.js. If we are not requiring it and are running it from the
// command line, we create a server instance and start listening for requests.
if (typeof module !== 'undefined' && !module.parent) {
  const generalApiEndpoints = __dirname + '/routes/';
  const mailerApiEndpoints = __dirname + '/mailer/mailer.js';

  const generalServer = new SceHttpServer(generalApiEndpoints, 8080);
  const mailerServer = new SceHttpServer(mailerApiEndpoints, 8082);

  generalServer.initializeEndpoints().then(() => {
    generalServer.openConnection();
  });
  mailerServer.initializeEndpoints().then(() => {
    mailerServer.openConnection();
  });
}

module.exports = { SceHttpServer }
