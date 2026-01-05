const express = require ('express');
const router = express.Router();
const visitCounter = require('../models/HomepageVisit');
const { FORBIDDEN, BAD_REQUEST, OK } = require('../../util/constants').STATUS_CODES;
const allowedOrigin = 'https://sce.sjsu.edu';

router.post('/visit', async (req, res) => {
  const origin = req.get('origin');
  const referer = req.get('referer');
  const allowed = origin === allowedOrigin || (referer && referer.startsWith(allowedOrigin));
  if(!allowed) return res.sendStatus(FORBIDDEN);
  try {
    await visitCounter.findOneAndUpdate(
      {},
      {$inc: {visitCount: 1}},
      { new: true, upsert: true }
    );
    res.sendStatus(OK);
  } catch (error) {
    res.sendStatus(BAD_REQUEST);
  }
});

router.get('/count', async (req, res) => {
  try {
    const response = await visitCounter.findOne({});
    const visitCount = response ? response.visitCount : 0;
    return res.status(OK).send({visitCount});
  } catch (error) {
    return res.sendStatus(BAD_REQUEST);
  }
});

module.exports = router;
