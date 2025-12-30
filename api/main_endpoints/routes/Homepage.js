const express = require ('express');
const router = express.Router();
const { OK, NOT_FOUND } = require('../../util/constants').STATUS_CODES;
const { getRandomImageUrl } = require('../util/HomepageImages');

router.get('/image', (req, res) => {
    const url = getRandomImageUrl();
    if(!url) return res.sendStatus(NOT_FOUND);
    res.status(OK).send(url);
});

module.exports = router;