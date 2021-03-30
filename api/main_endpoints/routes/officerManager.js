'use strict';

const express = require('express');
const router = express.Router();
const Manager = require('../models/OfficerManager.js');
const passport = require('passport');
require('../util/passport')(passport);
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
} = require('../../util/constants').STATUS_CODES;
const addErrorLog = require('../util/logging-helpers');
const membershipState = require('../../util/constants').MEMBERSHIP_STATE;

router.post('/submit', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req, membershipState.OFFICER)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  const data = {
    ...req.body
  };
  delete data.token;

  Manager.create(data, (error, post) => {
    if (error) {
      return res.sendStatus(BAD_REQUEST);
    }

    return res.status(OK).send(post);
  });
});

// Find all api if email is null/undefined
// else query by email
// if token is valid, all information is returned
// else, only public information is returned
router.post('/get', (req, res) => {
  let obj = {};
  if (typeof req.body.email !== 'undefined') obj = { email: req.body.email };
  Manager.find(obj, (error, forms) => {
    if (error) {
      const info = {
        userEmail:req.body.email,
        errorTime: new Date(),
        apiEndpoint: 'officerManager/get',
        errorDescription: error
      };
      addErrorLog(info);
      return res.sendStatus(BAD_REQUEST);
    } else if (checkIfTokenSent(req) &&
    (checkIfTokenValid(req, membershipState.OFFICER))) {
      return res.status(OK).send(forms);
    } else {
      const officers = [];
      forms.forEach(element => {
        const officer = new Manager({
          name: element.name,
          linkedin: element.linkedin,
          team: element.team,
          position: element.position,
          quote: element.quote,
          pictureUrl: element.pictureUrl
        });
        officers.push(officer);
      });
      return res.status(OK).send(officers);
    }

  });
});

// Delete request
// query by email
router.post('/delete', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req, membershipState.OFFICER)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  Manager.deleteOne({ email: req.body.email }, function(error, form) {
    if (error) {
      const info = {
        userEmail: req.body.email,
        errorTime: new Date(),
        apiEndpoint: 'officerManager/delete',
        errorDescription: error
      };
      addErrorLog(info);
      return res.sendStatus(BAD_REQUEST);
    }

    if (form.n < 1) {
      res.status(NOT_FOUND).send({ message: 'Form not found.' });
    } else {
      res.status(OK).send({ message: `${req.body.name} was deleted.` });
    }
  });
});

// Edit/Update a member record
// query by email
router.post('/edit', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req, membershipState.OFFICER)) {
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
        errorDescription: error
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
