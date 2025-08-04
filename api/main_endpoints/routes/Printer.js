const axios = require('axios');
const express = require('express');
const multer = require('multer');
const FormData = require('form-data');
const logger = require('../../util/logger');
const fs = require('fs');
const path = require('path');
const { MetricsHandler, register } = require('../../util/metrics.js');
const { cleanUpChunks, cleanUpExpiredChunks, recordPrintingFolderSize } = require('../util/Printer.js');

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
const AuditLogActions = require('../util/auditLogActions.js');
const { createAuditLog } = require('../util/auditLogHelpers.js');

// see https://github.com/SCE-Development/Quasar/tree/dev/docker-compose.dev.yml#L11
let PRINTER_URL = process.env.PRINTER_URL || 'http://localhost:14000';

const router = express.Router();

// stores file inside temp folder
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, 'printing'));
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + '_' + file.originalname);
  },
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
    logger.warn(
      'Printing is disabled, returning 200 to mock the printing server'
    );

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
  let totalFileSize = 0;
  const { copies, sides, id } = req.body;
  const action = AuditLogActions.PRINT_PAGE;

  if (!checkIfTokenSent(req)) {
    logger.warn('/sendPrintRequest was requested without a token');
    return res.sendStatus(UNAUTHORIZED);
  }
  const user = decodeToken(req);
  if (!user) {
    logger.warn('/sendPrintRequest was requested with an invalid token');
    return res.sendStatus(UNAUTHORIZED);
  }

  const details = {
    copies: parseInt(copies),
    sides,
    fileSize: totalFileSize,
    userEmail: user.email,
    printedAt: new Date(),
    printJobId: id,
    status: 'success' || 'fail'
  };

  if (!PRINTING.ENABLED) {
    details.status = 'mocked';
    // create audit log on print
    await createAuditLog({
      user,
      action,
      details
    });
    logger.warn('Printing is disabled, returning 200 to mock the printing server');
    return res.sendStatus(OK);
  }

  const chunks = await fs.promises.readdir(dir);
  const assembledPdfFromChunks = path.join(dir, id + '.pdf');

  for (let chunk of chunks) {
    if (path.extname(chunk) !== '.CHUNK') continue;
    if (!path.basename(chunk).includes(id)) continue;

    try {
      const chunkData = await fs.promises.readFile(path.join(dir, chunk));
      totalFileSize += chunkData.length;
      fs.appendFileSync(assembledPdfFromChunks, chunkData);
    } catch (err) {
      logger.error('/sendPrintRequest encountered an error while assembling pdf: ' + err);
      await cleanUpChunks(dir, id);
      return res.sendStatus(SERVER_ERROR);
    }
  }

  const stream = await fs.createReadStream(assembledPdfFromChunks);
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
    .then( async () => {
      details.status = 'success';
      // create audit log on print
      await createAuditLog({
        user,
        action,
        details
      });

      // delete file from temp folder after printing
      fs.unlink(file.path, (err) => {
        if (err) {
          logger.error(`Unable to delete file at path ${file.path}:`, err);
        }
      });
      res.sendStatus(OK);
    }).catch(async (err) => {
      logger.error('/sendPrintRequest had an error: ', err);
      details.status = 'fail';
      await createAuditLog({ user, action, details });
      res.sendStatus(SERVER_ERROR);
    });
});

module.exports = router;
