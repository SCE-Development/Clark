const fs = require('fs');
const path = require('path');
const logger = require('../../util/logger');
const { MetricsHandler } = require('../../util/metrics.js');
const User = require('../models/User.js');
const { PDFDocument } = require('pdf-lib');

/**
 * Deletes all chunks with the specified id from a directory
 * @param {String} dir The directory the chunks are stored in
 * @param {String} id  The UUID (36 char) assigned to the chunks
 */
async function cleanUpChunks(dir, id) {
  try {
    const chunks = await fs.promises.readdir(dir);

    for (let chunk of chunks) {
      if (!path.basename(chunk).includes(id)) continue;

      await fs.promises.unlink(path.join(dir, chunk), err => {
        logger.error(`Failed to delete chunk with id ${id} in ${dir}: ` + err);
      });
    }
  } catch (err) {
    logger.error('Encountered error while trying to delete chunks: ' + err);
    return false;
  }

  return true;
}

/**
 * Deletes all chunks of specified age or older, 'expired', from a directory
 * @param {String} dir The directory the chunks are stored in
 * @param {Number} expiry Minimum age (ms) to be considered expired
 */
async function cleanUpExpiredChunks(dir, expiry) {
  try {
    const chunks = await fs.promises.readdir(dir);

    for (let chunk of chunks) {
      if (!['.pdf', '.CHUNK'].includes(path.extname(chunk))) continue;

      const stats = await fs.promises.stat(path.join(dir, chunk));
      const age = Date.now() - stats.mtimeMs;

      if (age >= expiry) {
        await fs.promises.unlink(path.join(dir, chunk), err => {
          logger.warn(`Failed to delete expired chunk in ${dir}: ` + err);
        });

        MetricsHandler.totalExpiredBytesDeleted.inc(stats.size);
        MetricsHandler.totalExpiredChunksDeleted.inc(1);
      }
    }
  } catch (err) {
    logger.error(`Encountered error while trying to delete expired chunks in ${dir}: `  + err);
    return false;
  }

  return true;
}

/**
 * Gets size of printing folder and records it in the prometheus metric
 * @param {String} dir The directory of the printing folder
 */
async function recordPrintingFolderSize(dir) {
  const files = await fs.promises.readdir(dir);
  let sizeOfDir = 0;

  for (file of files) {
    sizeOfDir += await fs.promises.stat(path.join(dir, file)).then(stat => stat.size);
  }

  MetricsHandler.currentSizeOfPrintingFolderBytes.set(sizeOfDir);
}


/**
 * Modify the user's pagesPrinted field based on the length of their print request
 * @param {string} userId           id of the current user
 * @param {Number} numPages         the number of pages of the current print request
 * @returns {boolean}               Returns if the database operation was successful
 */

function modifyPagesPrinted(userId, numPages) {
  return new Promise((resolve) => {
    try {
      User.findByIdAndUpdate(
        userId,
        {
          $inc: { pagesPrinted: numPages },
        }, {
          new: true,
        }
        , (error, result) => {
          if (error) {
            logger.error('modifyPagesPrinted got an error querying mongodb: ', error);
            return resolve(false);
          }
          if (!result) {
            logger.info(`User ${userId} not found in the database`);
          }
          return resolve(!!result);
        });
    } catch (err) {
      logger.error('modifyPagesPrinted encountered an error querying mongodb: ', err);
      return resolve(false);
    }
  });
}

async function getPageCount(file) {
  const buffer = await fs.promises.readFile(file);
  const pdf = await PDFDocument.load(buffer);
  return pdf.getPageCount();
}

module.exports = { cleanUpChunks, cleanUpExpiredChunks, recordPrintingFolderSize, modifyPagesPrinted, getPageCount };
