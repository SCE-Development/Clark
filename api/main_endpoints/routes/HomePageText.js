const express = require('express');
const router = express.Router();

router.get('/getText', (req, res) => {
  const newAdd = ['Hello', 'Nuh uh', 'brotha', 'this is the best club ever :3'];
  const index = Math.floor(Math.random() * (4));
  res.send(newAdd[index]);
});

module.exports = router;
