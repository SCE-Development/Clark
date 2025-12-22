const axios = require('axios');
const express = require('express');
const multer = require('multer');
const FormData = require('form-data');
const logger = require('../../util/logger');
const fs = require('fs');
const path = require('path');
const { MetricsHandler, register } = require('../../util/metrics.js');
const { cleanUpChunks, cleanUpExpiredChunks, recordPrintingFolderSize } = require('../util/Printer.js');

const { decodeToken } = require('../util/token-functions.js');
const {
  OK,
  UNAUTHORIZED,
  NOT_FOUND,
  SERVER_ERROR,
  BAD_REQUEST
} = require('../../util/constants').STATUS_CODES;
const {
  PRINTING = {}
} = require('../../config/config.json');
const User = require('../models/User.js');

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
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + '_' + file.originalname);
  }
});

const upload = multer({ storage });

const FIVE_MINUTES_MS = 300000;
const TEN_SECONDS_MS = 10000;

if (PRINTING.ENABLED) {
  setInterval(() => {
    const dir = path.join(__dirname, 'printing');
    cleanUpExpiredChunks(dir, FIVE_MINUTES_MS);
    recordPrintingFolderSize(dir);
  }, TEN_SECONDS_MS);
}

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
      MetricsHandler.sshTunnelErrors.inc({ type: 'Printer' });
      return res.sendStatus(NOT_FOUND);
    });
});

router.post('/sendPrintRequest', upload.single('chunk'), async (req, res) => {
  const decoded = await decodeToken(req);
  if (!decoded.token) {
    logger.warn('/sendPrintRequest was requested with an invalid token');
    return res.sendStatus(decoded.status);
  }
  // this makes printing pass in unit tests, at some point need to test axios call
  if (!PRINTING.ENABLED) {
    logger.warn('Printing is disabled, returning 200 and dummy print id to mock the printing server');
    return res.status(OK).send({ printId: null });
  }
  const user = await User.findById(decoded.token._id);

  const dir = path.join(__dirname, 'printing');
  const { totalChunks, chunkIdx } = req.body;

  // reassemble pdf on last chunk received
  if (Number(chunkIdx) < totalChunks - 1) {
    return res.sendStatus(OK);
  }

  const { copies, sides, id, totalPages } = req.body;

  const chunks = await fs.promises.readdir(dir);
  const assembledPdfFromChunks = path.join(dir, id + '.pdf');

  for (let chunk of chunks) {
    if (path.extname(chunk) !== '.CHUNK') continue;
    if (!path.basename(chunk).includes(id)) continue;

    try {
      const chunkData = await fs.promises.readFile(path.join(dir, chunk));
      fs.appendFileSync(assembledPdfFromChunks, chunkData);
    } catch (err) {
      logger.error('/sendPrintRequest encountered an error while assembling pdf: ' + err);
      await cleanUpChunks(dir, id);
      return res.sendStatus(SERVER_ERROR);
    }
  }

  const stream = await fs.promises.readFile(assembledPdfFromChunks);
  const data = new FormData();
  data.append('file', stream, {filename: id, type: 'application/pdf'});
  data.append('copies', copies);
  data.append('sides', sides);

  if (Number(totalPages) > 30 - user.pagesPrinted - user.escrowPagesPrinted) {
    await cleanUpChunks(dir, id);
    return res.sendStatus(BAD_REQUEST);
  }

  try {
    // full pdf can be sent to quasar no problem
    const printRes = await axios.post(PRINTER_URL + '/print', data, {
      headers: {
        ...data.getHeaders(),
      },
      maxContentLength: 1024 * 1024 * 150, // 150 mb
      maxBodyLength: Infinity
    });

    // { print_id: null | string }
    const printId = printRes.data;

    await cleanUpChunks(dir, id);
    res.status(OK).send(printId);

    user.escrowPagesPrinted += Number(totalPages);
    await user.save();
  } catch (err) {
    logger.error('/sendPrintRequest had an error: ', err);

    await cleanUpChunks(dir, id);
    res.sendStatus(SERVER_ERROR);
  }
});

router.get('/status', async (req, res) => {
  const decodedToken = await decodeToken(req);
  if (!decodedToken || Object.keys(decodedToken) === 0) {
    logger.warn('/status was requested with an invalid token');
    return res.sendStatus(UNAUTHORIZED);
  }
  if (!PRINTING.ENABLED) {
    logger.warn('Printing is disabled, returning 200 and completed status to mock the printing server');
    return res.status(OK).send({ status: 'completed' });
  }

  try {
    const url = new URL('/status/', PRINTER_URL);
    url.searchParams.append('id', req.query.id);
    const response = await fetch(url, {
      method: 'GET',
    });

    const user = await User.findById(decodedToken._id);

    // { status: string }
    const json = await response.json();
    const pages = Math.abs(Number(req.query.pages));

    if (json.status === 'completed') {
      user.pagesPrinted += pages;
      user.escrowPagesPrinted -= pages;
      await user.save();
    }

    if (json.status === 'failed') {
      user.escrowPagesPrinted -= pages;
      await user.save();
    }

    res.status(OK).send(json);
  } catch (err) {
    res.sendStatus(SERVER_ERROR);
  }
});

module.exports = router;
