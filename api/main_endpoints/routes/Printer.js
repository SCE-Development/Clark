const axios = require('axios');
const express = require('express');
const multer = require('multer');
const logger = require('../../util/logger');
const fs = require('fs');
const path = require('path');

const { healthCheck, print, getPageCount, getFileAndFormData } = require('../util/Printer.js');
const {
  decodeToken,
  checkIfTokenSent,
  checkIfTokenValid,
} = require('../util/token-functions.js');
const {
  OK,
  UNAUTHORIZED,
  NOT_FOUND,
  SERVER_ERROR,
  BAD_REQUEST,
} = require('../../util/constants').STATUS_CODES;
const {
  PRINTING = {}
} = require('../../config/config.json');
const membershipState = require('../../util/constants').MEMBERSHIP_STATE;
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

async function deleteFile(filePath) {
  fs.unlink(filePath, (err) => {
    if (err) {
      logger.error(`Unable to delete file at path ${filePath}:`, err);
    }
  });
}

const fileUpload = process.env.NODE_ENV !== 'test' ? upload.single('file') : (req, res, next) => next();

router.get('/healthCheck', async (req, res) => {
/*
 * How these work with Quasar:
 * https://github.com/SCE-Development/Quasar/wiki/How-do-Health-Checks-Work%3F
 */
  if (!PRINTING.ENABLED && process.env.NODE_ENV !== 'test') {
    logger.warn('Printing is disabled, returning 200 to mock the printing server');
    return res.sendStatus(OK);
  }
  const healthy = await healthCheck();
  if (!healthy) {
    return res.sendStatus(NOT_FOUND);
  }
  return res.sendStatus(OK);
});

router.post('/sendPrintRequest', fileUpload, async (req, res) => {
  if (!checkIfTokenSent(req)) {
    logger.warn('/sendPrintRequest was requested without a token');
    return res.sendStatus(UNAUTHORIZED);
  }
  if (!await checkIfTokenValid(req, membershipState.MEMBER)) {
    logger.warn('/sendPrintRequest was requested with an invalid token');
    return res.sendStatus(UNAUTHORIZED);
  }
  if (!PRINTING.ENABLED && process.env.NODE_ENV !== 'test') {
    logger.warn('Printing is disabled, returning 200 to mock the printing server');
    return res.sendStatus(OK);
  }
  const email = decodeToken(req).email;
  const {copies, sides} = req.body;
  const {file, data} = await getFileAndFormData(req);
  
  try {
    const user = await User.findOne({ email });
    const sidesUsed = sides === 'one-sided' ? 1 : 2;
    const pagesCount = await getPageCount(file.path);
    const wholePagesUsed = Math.floor(pagesCount / sidesUsed);
    const remainder = pagesCount % sidesUsed;
    const pagesToBeUsedInPrintRequest = (wholePagesUsed + remainder) * parseInt(copies);

    if (user.pagesPrinted + pagesToBeUsedInPrintRequest > 30) {
      await deleteFile(file.path);
      logger.warn('Print request exceeded weekly limit');
      return res.sendStatus(BAD_REQUEST);
    }

    await print(data);

    await User.updateOne(
      { email },
      {
        $inc: { pagesPrinted: pagesToBeUsedInPrintRequest },
      }
    );
    await deleteFile(file.path);

    res.sendStatus(OK);
  } catch (err) {
    if (file && file.path) {
      await deleteFile(file.path);
    }
    logger.error('/sendPrintRequest had an error: ', err);
    return res.sendStatus(SERVER_ERROR);
  }
});

module.exports = router;
