const express = require('express');
const router = express.Router();
const Visit = require('../models/Visit');
const {
  NOT_FOUND,
  FORBIDDEN,
  BAD_REQUEST,
  OK,
  INTERNAL_SERVER_ERROR
} = require('../../util/constants').STATUS_CODES;
const logger = require('../../util/logger');

const ALLOWED_ORIGIN = 'https://sce.sjsu.edu';
const VALID_TYPES = Visit.schema.path('type').enumValues;

router.post('/:type', async (req, res) => {
  const { type } = req.params;

  if (process.env.NODE_ENV === 'production') {
    const origin = req.get('origin');
    const referer = req.get('referer');
    const isAllowed = origin === ALLOWED_ORIGIN || (referer && referer.startsWith(ALLOWED_ORIGIN));

    if (!isAllowed) return res.sendStatus(FORBIDDEN);
  }

  if (!VALID_TYPES.includes(type)) {
    return res.status(NOT_FOUND).send({ message: `Invalid page type: ${type}` });
  }

  try {
    await Visit.findOneAndUpdate(
      { type },
      { $inc: { visitCount: 1 } },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.sendStatus(OK);
  } catch (error) {
    logger.error(`Error incrementing visit for ${type}:`, error);
    return res.sendStatus(INTERNAL_SERVER_ERROR);
  }
});

router.get('/:type', async (req, res) => {
  const { type } = req.params;

  if (!VALID_TYPES.includes(type)) return res.sendStatus(NOT_FOUND);

  try {
    const record = await Visit.findOne({ type });
    const visitCount = record ? record.visitCount : 0;
    return res.status(OK).send({ visitCount });
  } catch (error) {
    return res.sendStatus(BAD_REQUEST);
  }
});

module.exports = router;
