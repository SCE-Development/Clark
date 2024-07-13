const axios = require('axios');
const express = require('express');
const multer = require('multer');
const FormData = require('form-data');
const logger = require('../../util/logger');
const fs = require('fs');
const path = require('path');

const {
  decodeToken,
  checkIfTokenSent,
} = require('../util/token-functions.js');
const {
  OK,
  UNAUTHORIZED,
  NOT_FOUND,
  SERVER_ERROR,
} = require('../../util/constants').STATUS_CODES;
const {
  PRINTING = {}
} = require('../../config/config.json');

// see https://github.com/SCE-Development/Quasar/tree/dev/docker-compose.dev.yml#L11
let PRINTER_URL = process.env.PRINTER_URL
  || 'http://localhost:14000';

const router = express.Router();

// stores file inside temp folder
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, 'printing'));
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = new Date().toISOString();
    cb(null, uniqueSuffix + '_' + file.originalname);
  }
});

const upload = multer({ storage });

router.get('/healthCheck', async (req, res) => {
/*
 * How these work with Quasar:
 * https://github.com/SCE-Development/Quasar/wiki/How-do-Health-Checks-Work%3F
 */
  if (!PRINTING.ENABLED) {
    logger.warn('Printing is disabled, returning 200 to mock the printing server');
    return res.sendStatus(OK);
  }
  await axios
    .get(PRINTER_URL + '/healthcheck/printer')
    .then(() => {
      return res.sendStatus(OK);
    })
    .catch((err) => {
      logger.error('Printer SSH tunnel is down: ', err);
      return res.sendStatus(NOT_FOUND);
    });
});

router.post('/sendPrintRequest', upload.single('file'), async (req, res) => {
  if (!checkIfTokenSent(req)) {
    logger.warn('/sendPrintRequest was requested without a token');
    return res.sendStatus(UNAUTHORIZED);
  }
  if (!await decodeToken(req)) {
    logger.warn('/sendPrintRequest was requested with an invalid token');
    return res.sendStatus(UNAUTHORIZED);
  }
  if (!PRINTING.ENABLED) {
    logger.warn('Printing is disabled, returning 200 to mock the printing server');
    return res.sendStatus(OK);
  }

  const { copies, sides } = req.body;
  const file = req.file;
  const data = new FormData();
  data.append('file', fs.createReadStream(file.path), { filename: file.originalname });
  data.append('copies', copies);
  data.append('sides', sides);
  axios.post(PRINTER_URL + '/print',
    data,
    {
      headers: {
        ...data.getHeaders(),
      }
    })
    .then(() => {
      // delete file from temp folder after printing
      fs.unlink(file.path, (err) => {
        if (err) {
          logger.error(`Unable to delete file at path ${file.path}:`, err);
        }
      });
      res.sendStatus(OK);
    }).catch((err) => {
      logger.error('/sendPrintRequest had an error: ', err);
      res.sendStatus(SERVER_ERROR);
    });
});

module.exports = router;
