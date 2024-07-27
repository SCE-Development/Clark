const express = require('express');
const router = express.Router();

router.get('/getAdvertisements', (req, res) => {
  const newAd = [
    'this is the best club ever ?XD',
    'Join us for Pancake Thursdays at 11am!',
    'Located at Engineering Building room 294!',
    'Ethan was here kekekek ( ͡° ͜ʖ ͡°)',
  ];
  const index = Math.floor(Math.random() * (4));
  res.send(newAd[index]);
});

module.exports = router;
