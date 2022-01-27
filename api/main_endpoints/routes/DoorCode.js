const express = require('express');
const router = express.Router();
const DoorCode = require('../models/DoorCode');
const {
  checkIfTokenSent,
  checkIfTokenValid,
} = require('../../util/token-functions');
const {
  OK,
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
} = require('../../util/constants').STATUS_CODES;
const addErrorLog = require ('../util/logging-helpers');
const membershipState = require('../../util/constants').MEMBERSHIP_STATE;

router.get('/getDoorCodes', (req, res) => {
  DoorCode.find()
    .then(doorcodes => res.status(OK).send(doorcodes))
    .catch(error => {
      const info = {
        errorTime: new Date(),
        apiEndpoint: 'DoorCode/getDoorCodes',
        errorDescription: error
      };
      addErrorLog(info);
      res.status(BAD_REQUEST).send({ error, message: 'Getting codes failed' });
    });
});

router.get('/getAvailableDoorCode', (req, res) => {
  DoorCode.findOne({ usersAssigned: { $lt: 2 } }).then((doorcodes) =>
    res.status(OK).send(doorcodes)
  ).catch(() => {
    res.status(BAD_REQUEST).send({ message: 'No codes left.' });
  });
});

router.post('/addCode', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req, membershipState.OFFICER)) {
    return res.sendStatus(UNAUTHORIZED);
  }

  const newCode = new DoorCode({
    doorCode: req.body.doorCode,
    doorCodeValidUntil: req.body.doorCodeValidUntil,
    usersAssigned: req.body.usersAssigned,
  });

  DoorCode.create(newCode, (error, post) => {
    if (error) {
      return res.sendStatus(BAD_REQUEST);
    }
    return res.status(OK).send(post);
  });
});

router.post('/editCode', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req, membershipState.OFFICER)) {
    return res.sendStatus(UNAUTHORIZED);
  }

  const {
    doorCode,
    doorCodeValidUntil,
    usersAssigned,
  } = req.body;
  DoorCode.findOne({ _id: req.body.id  })
    .then((code) => {
      code.doorCode = doorCode || code.doorCode;
      code.doorCodeValidUntil = doorCodeValidUntil || code.doorCodeValidUntil;
      code.usersAssigned = usersAssigned || code.usersAssigned;
      code
        .save()
        .then((ret) => {
          res.sendStatus(OK);
        })
        .catch((error) => {
          res.status(BAD_REQUEST).send({
            error,
            message: 'door code was not updated',
          });
        });
    })
    .catch((error) => {
      res.status(NOT_FOUND).send({ error, message: 'door code not found' });
    });
});

router.post('/removeCode', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req, membershipState.OFFICER)) {
    return res.sendStatus(UNAUTHORIZED);
  }

  DoorCode.deleteOne({ _id: req.body.id  }, (error, form) => {
    if (error) {
      const info = {
        errorTime: new Date(),
        apiEndpoint: 'DoorCode/removeItem',
        errorDescription: error,
      };
      return res.sendStatus(BAD_REQUEST);
    }
    if (form.n < 1) {
      return res.sendStatus(NOT_FOUND);
    } else {
      return res.sendStatus(OK);
    }
  });
});

module.exports = router;
