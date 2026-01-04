const express = require ('express');
const router = express.Router();
const visitCounter = require('../models/HomepageVisit');
const { BAD_REQUEST, OK } = require('../../util/constants').STATUS_CODES;

router.post('/visit', async (req, res) => {
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
