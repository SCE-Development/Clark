const express = require('express');
const router = express.Router();
const DoorCode = require('../models/DoorCode');
const {
  checkIfTokenSent,
  checkIfTokenValid,
} = require('../util/token-functions');
const {
  OK,
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
} = require('../../util/constants').STATUS_CODES;
const addErrorLog = require ('../util/logging-helpers');

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
  DoorCode.findOne({userEmails : {$exists:true},
    $where:'this.userEmails.length<2'}).then((doorcodes) => {
    if(doorcodes) {
      res.status(OK).send(doorcodes);
    } else {
      res.status(BAD_REQUEST).send({ message: 'No codes left.' });
    }
  }).catch(() => {
    res.status(BAD_REQUEST).send({ message: 'No codes left.' });
  });
});

router.post('/getPersonsDoorCode', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }

  const {
    email,
  } = req.body;

  DoorCode.findOne({userEmails: email }).then((doorCode) => {
    if(doorCode) {
      res.status(OK).send({doorCode});
    } else {
      res.status(NOT_FOUND).send({ message: 'No codes found.' });
    }
  }).catch(() => {
    res.status(NOT_FOUND).send({ message: 'No codes found.' });
  });
});

router.post('/addCode', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }

  const newCode = new DoorCode({
    doorCode: req.body.doorCode,
    doorCodeValidUntil: req.body.doorCodeValidUntil,
    userEmails: req.body.userEmails,
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
  } else if (!checkIfTokenValid(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }

  const {
    doorCode,
    doorCodeValidUntil,
    userEmails,
  } = req.body;
  DoorCode.findOne({ _id: req.body.id  })
    .then((code) => {
      code.doorCode = doorCode || code.doorCode;
      code.doorCodeValidUntil = doorCodeValidUntil || code.doorCodeValidUntil;
      code.userEmails =  userEmails || code.userEmails;
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
  } else if (!checkIfTokenValid(req)) {
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
