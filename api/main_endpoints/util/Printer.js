const axios = require("axios");
const logger = require("../../util/logger");

let PRINTER_URL = process.env.PRINTER_URL || "http://localhost:14000";

async function healthCheck() {
  return new Promise((resolve) => {
    axios
      .get(PRINTER_URL + "/healthcheck/printer")
      .then(() => {
        resolve(true);
      })
      .catch((err) => {
        logger.error("Printer SSH tunnel is down: ", err);
        resolve(false);
    });
  });
}

async function print(data) {
  return new Promise((resolve, reject) => {
    axios.post(PRINTER_URL + '/print',
      data,
      {
        headers: {
          ...data.getHeaders(),
        }
      })
      .then(resolve)
      .catch(reject);
  });
}

module.exports = { healthCheck, print };
