const fs = require('fs');
const path = require('path');

/**
 * The special object to represent the pair of endpoint name and file path.
 */
class EndpointPair {
  /**
   * Create an EndpointPair
   * @param {String} endpointName The name of an API endpoint, e.g. Event, or
   * LedSign.
   * @param {String} filePath The path to a file of the given endpoint name,
   * e.g. api/routes/Event.js or client/led_sign/led_sign_client.js
   */
  constructor(endpointName, filePath) {
    this.endpointName = endpointName;
    this.filePath = filePath;
  }
}

class PathParser {
  /**
   * Asynchronously read all the files in a directory. It does not do a
   * recursive search of subdirectories and returns an array of endpoint names
   * and file paths.
   * @param {string} directoryPath The path to a directory with API files in it.
   * @returns {Promise<Array<EndpointPair>>} Resolves with the array of
   * EndpointPairs for each file in a directory.
   */
  static async getFilesInDirectory(directoryPath) {
    return new Promise((resolve, reject) => {
      let pairs = [];
      fs.readdir(directoryPath, async (err, files) => {
        if (!err) {
          files.map((file) => {
            if (!fs.lstatSync(directoryPath + file).isDirectory()) {
              const pathObject = path.parse(path.join(directoryPath, file));
              const endpointName = pathObject.name;
              const endpointPair = new EndpointPair(
                endpointName, path.join(
                  pathObject.dir, pathObject.base
                ));
              pairs.push(endpointPair);
            }
          });
          resolve(pairs);
        }
      });
    });
  }

  /**
   * Takes in a path and generates EndpointPairs if the path is either a
   * directory or single file.
   * @param {String} filePath The path to a directory or file.
   * @returns {Promise<Array<EndpointPair>>} The pairs of API endpoint
   * names and file paths from the specified path(s).
   */
  static async generatePairsFromFilePath(filePath) {
    let pairs = [];
    if (fs.lstatSync(filePath).isDirectory()) {
      pairs = await this.getFilesInDirectory(filePath);
    } else {
      const pathObject = path.parse(filePath);
      const endpointName = pathObject.name;
      const endpointPair = new EndpointPair(
        endpointName, path.join(
          pathObject.dir, pathObject.base
        ));
      pairs.push(endpointPair);
    }
    return pairs;
  }

  /**
   * Take a path or array of paths from SceHttpServer and resolve
   * the API endpoint names and filepaths for the class to use.
   * @param {(String|Array<String>)} pathFromServer Path(s) supplied to
   * SceHttpServer.
   * @returns {Promise<Array<EndpointPair>>} All of the pairs of API endpoint
   * names and file paths from the specified path(s).
   */
  static async parsePath(pathFromServer) {
    let result = [];
    if (Array.isArray(pathFromServer)) {
      await Promise.all(
        pathFromServer.map(async (path) => {
          const generatedPairs = await this.generatePairsFromFilePath(path);
          result = result.concat(generatedPairs);
        })
      );
    } else {
      result = await this.generatePairsFromFilePath(pathFromServer);
    }
    return result;
  }
}

module.exports = { PathParser };
