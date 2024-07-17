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



module.exports = { healthCheck };
