const express = require('express');
const router = express.Router();
const RFID = require('../models/RFID');
const {
  checkIfTokenSent,
  checkIfTokenValid,
} = require('../../util/token-functions');
const { OK, BAD_REQUEST, UNAUTHORIZED, FORBIDDEN, NOT_FOUND } =
  require('../../util/constants').STATUS_CODES;
module.exports = router;
const add_RFID = false;

router.post('/validateRFID', (req, res) => {
  const { byte } = req.body;
  RFID.findOne({ byte })
    .then((RFID) => {
      RFID.last_scanned = new Date().toString();
      res.sendStatus(OK);
    })
    .catch(() => {
      res.sendStatus(NOT_FOUND);
    });
});

function turn_on_add_RFID() {
  addRFID = true;
}
function turn_off_add_RFID() {
  addRFID = false;
}

router.post('/addUser', (req, res) => {
  turn_on_add_RFID();

  //Callback function here
  getInfoFromESP32();
  const newEvent = new RFID({
    name: req.body.name,
    //gonna come from the hardware
    ///byte: req.body.description,
    last_scanned: new Date().toString(),
  });

  RFID.create(newEvent, (error) => {
    if (error) {
      return res.sendStatus(BAD_REQUEST);
    } else {
      return res.sendStatus(OK);
    }
  });
});

router.get('/getDesserts', (req, res) => {
  Dessert.find()
    .then((items) => res.status(OK).send(items))
    .catch((error) => {
      res.sendStatus(BAD_REQUEST);
    });
});

router.post('/createDessert', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req, membershipState.OFFICER)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  const newEvent = new Dessert({
    title: req.body.title,
    description: req.body.description,
    rating: req.body.rating,
  });

  Dessert.create(newEvent, (error, post) => {
    if (error) {
      return res.sendStatus(BAD_REQUEST);
    } else {
      return res.json(post);
    }
  });
});

router.post('/editDessert', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req, membershipState.OFFICER)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  const { title, description, rating, _id } = req.body;
  Dessert.findOne({ _id })
    .then((Dessert) => {
      Dessert.title = title || Dessert.title;
      Dessert.description = description || Dessert.description;
      Dessert.rating = rating || Dessert.rating;
      Dessert.save()
        .then(() => {
          res.sendStatus(OK);
        })
        .catch(() => {
          res.sendStatus(BAD_REQUEST);
        });
    })
    .catch(() => {
      res.sendStatus(NOT_FOUND);
    });
});

router.delete('/deleteDessert', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req, membershipState.OFFICER)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  Dessert.deleteOne({ _id: req.body._id })
    .then((result) => {
      if (result.n < 1) {
        res.sendStatus(NOT_FOUND);
      } else {
        res.sendStatus(OK);
      }
    })
    .catch(() => {
      res.sendStatus(BAD_REQUEST);
    });
});
