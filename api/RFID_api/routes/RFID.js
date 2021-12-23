const express = require('express');
const router = express.Router();
const RFID = require('../models/RFID');
const {
  checkIfTokenSent,
  checkIfTokenValid,
} = require('../../util/token-functions');
const { OK, BAD_REQUEST, UNAUTHORIZED, FORBIDDEN, NOT_FOUND } =
  require('../../util/constants').STATUS_CODES;

let add_RFID = false;
let new_name = null;

router.post('/validateRFID', (req, res) => {
  const { byte } = req.body;
  if (add_RFID) {
    const newEvent = new RFID({
      name: new_name,
      byte: req.body.byte,
    });
    RFID.create(newEvent, (error) => {
      if (error) {
        res.sendStatus(BAD_REQUEST);
      } else {
        res.sendStatus(OK);
      }
      new_name = null;
      clearTimeout();
      add_RFID = false;
    });
  } else {
    RFID.findOne({ byte })
      .then((result) => {
        if (result != null) {
          res.sendStatus(OK);
        } else {
          res.sendStatus(NOT_FOUND);
        }
      })
      .catch(() => {
        res.sendStatus(NOT_FOUND);
      });
  }
});

router.post('/createRFID', (req, res) => {
  if (add_RFID) {
    return res.sendStatus(BAD_REQUEST);
  }
  add_RFID = true;
  new_name = req.body.name;
  setTimeout(() => {
    add_RFID = false;
    new_name = null;
  }, 60000);
  return res.sendStatus(OK);
});

router.get('/getRFIDs', (req, res) => {
  RFID.find()
    .then((items) => res.status(OK).send(items))
    .catch((error) => {
      res.sendStatus(BAD_REQUEST);
    });
});

router.delete('/deleteRFID', (req, res) => {
  RFID.deleteOne({ _id: req.body._id })
    .then((result) => {
      if (result.n < 1) {
        return res.sendStatus(BAD_REQUEST);
      } else {
        return res.sendStatus(OK);
      }
    })
    .catch((error) => {
      res.sendStatus(BAD_REQUEST);
    });
});

module.exports = router;
