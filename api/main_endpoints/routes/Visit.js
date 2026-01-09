const express = require ('express');
const router = express.Router();
const Visit = require('../models/Visit');
const { NOT_FOUND, FORBIDDEN, BAD_REQUEST, OK } = require('../../util/constants').STATUS_CODES;
const SCE_SJSU_EDU = 'https://sce.sjsu.edu';
const pages = Visit.schema.path('type').enumValues;

router.post('/:type', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    const origin = req.get('origin');
    const referer = req.get('referer');
    const allowed = origin === SCE_SJSU_EDU || (referer && referer.startsWith(allowedOrigin));
    if(!allowed) return res.sendStatus(FORBIDDEN);
  }
  const {type} = req.params;
  if(!pages.includes(type)) return res.sendStatus(NOT_FOUND);
  try {
    await Visit.findOneAndUpdate(
      {type},
      {$inc: {visitCount: 1}},
      {new: true, upsert: true}
    );
    res.sendStatus(OK);
  } catch (error) {
    res.sendStatus(BAD_REQUEST);
  }
});

router.get('/:type', async (req, res) => {
  const {type} = req.params;
  if(!pages.includes(type)) return res.sendStatus(NOT_FOUND);
  try {
    const response = await Visit.findOne({type});
    const visitCount = response ? response.visitCount : 0;
    return res.status(OK).send({visitCount});
  } catch (error) {
    return res.sendStatus(BAD_REQUEST);
  }
});

module.exports = router;
