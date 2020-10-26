const express = require('express');
const router = express.Router();

const {
  OK,
} = require('../../util/constants').STATUS_CODES;

router.post('/ResumeForm', (req, res) => {
  let fs = require('fs');
  fs.writeFile('resumeContents.json', JSON.stringify(req.body), (err) =>{
  });

  res.send(OK);
});
module.exports = router;
