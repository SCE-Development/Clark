const axios = require('axios');
const logger = require('../../util/logger');
const { PDFDocument } = require('pdf-lib');
const FormData = require('form-data');
const fs = require('fs');

let PRINTER_URL = process.env.PRINTER_URL || 'http://localhost:14000';

async function healthCheck() {
  return new Promise((resolve) => {
    axios
      .get(PRINTER_URL + '/healthcheck/printer')
      .then(() => {
        resolve(true);
      })
      .catch((err) => {
        logger.error('Printer SSH tunnel is down: ', err);
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

async function getPageCount(filePath) {
  const fileBuffer = await fs.promises.readFile(filePath);
  const printFile = await PDFDocument.load(fileBuffer);
  return printFile.getPageCount();
}

async function getFileAndFormData(req) {
  const data = new FormData();
  data.append('file', fs.createReadStream(req.file.path), { filename: req.file.originalname });
  data.append('copies', req.body.copies);
  data.append('sides', req.body.sides);
  return {file: req.file, data};
}

module.exports = { healthCheck, print, getPageCount, getFileAndFormData };
