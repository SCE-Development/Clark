'use strict';

const express = require('express');
const router = express.Router();
const Manager = require('../models/OfficerManager.js');
const settings = require('../util/settings');
const logger = require(`${settings.util}/logger`);
const passport = require('passport');
require('../config/passport')(passport);
const {
  checkIfTokenSent,
  checkIfTokenValid
} = require('../util/token-functions');
const {
  OK,
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND
} = require('../constants').STATUS_CODES;
const addErrorLog = require('../util/errorLog');

router.post('/submit', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  const data = {
    ...req.body
  };
  delete data.token;

  Manager.create(data, (error, post) => {
    if (error) {
      logger.log(`Officer Manager /submit error: ${error}`);
      return res.sendStatus(BAD_REQUEST);
    }

    return res.status(OK).send(post);
  });
});

// Find all api if email is null/undefined
// else query by email
router.post('/GetForm', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  let obj = {};
  if (typeof req.body.email !== 'undefined') obj = { email: req.body.email };

  Manager.find(obj, (error, forms) => {
    if (error) {
      const info = {
        userEmail:req.body.email,
        errorTime: new Date(),
        apiEndpoint: 'officerManager/GetForm',
        errorDescription: 'error'
      };
      addErrorLog(info);
      return res.sendStatus(BAD_REQUEST);
    }

    return res.status(OK).send(forms);
  });
});

// Delete request
// query by email
router.post('/delete', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  Manager.deleteOne({ email: req.body.email }, function(error, form) {
    if (error) {
      const info = {
        userEmail: req.body.email,
        errorTime: new Date(),
        apiEndpoint: 'officerManager/delete',
        errorDescription: 'error'
      };
      addErrorLog(info);
      return res.sendStatus(BAD_REQUEST);
    }

    if (form.n < 1) {
      logger.log(`Officer Manager /Delete3DForm error: ${error}`);
      res.status(NOT_FOUND).send({ message: 'Form not found.' });
    } else {
      logger.log(`Officer Manager /Delete3DForm deleted: ${req.body.name}`);
      res.status(OK).send({ message: `${req.body.name} was deleted.` });
    }
  });
});

// Edit/Update a member record
// query by email
router.post('/edit', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  const query = { email: req.body.email };
  const form = {
    ...req.body
  };
  delete form.token;

  Manager.updateOne(query, { ...form }, function(error, result) {
    if (error) {
      const info = {
        userEmail:req.body.email,
        errorTime: new Date(),
        apiEndpoint: 'officerManager/edit',
        errorDescription: 'error'
      };
      addErrorLog(info);
      return res.sendStatus(BAD_REQUEST);
    }
    if (result.nModified < 1) {
      return res
        .status(NOT_FOUND)
        .send({ message: `${req.body.email} not found.` });
    }
    return res.status(OK).send({ message: `${req.body.email} was updated.` });
  });
});

module.exports = router;
