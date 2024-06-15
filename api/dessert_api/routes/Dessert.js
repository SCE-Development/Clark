const express = require('express');
const router = express.Router();
const Dessert = require('../models/Dessert');
const { STATUS_CODES } = require('../../util/constants.js');
const {verifyToken} = require('../../util/token-verification.js');

router.post('/createDessert', (req, res) => {
    const token = req.body.token;

    if (!verifyToken(token)) {
        return res.sendStatus(STATUS_CODES.UNAUTHORIZED);
    }

    const isValid = verifyToken(token);

    if (!isValid) {
        return res.sendStatus(STATUS_CODES.UNAUTHORIZED);
    }

    const { rating } = req.body;
    const numberSent = !Number.isNaN(Number(rating));
  
    const newEvent = new Dessert({
      name: req.body.name,
      description: req.body.description,
      rating: numberSent ? Number(rating) : undefined,
    });
  
    Dessert.create(newEvent)
      .then((post) => {
        return res.json(post);
      })
      .catch(
        (error) => res.sendStatus(BAD_REQUEST)
      );
  });

  router.get('/getDesserts', (req, res) => {
    Dessert.find()
        .then(items => res.status(STATUS_CODES.OK).send(items))
        .catch((error) => {
            res.status(STATUS_CODES.BAD_REQUEST).json({ error });
        });
  });

router.post('/editDessert', (req, res) => {
    const token = req.body.token;

    if (!verifyToken(token)) {
        return res.sendStatus(STATUS_CODES.UNAUTHORIZED);
    }

    const isValid = verifyToken(token);

    if (!isValid) {
        return res.sendStatus(STATUS_CODES.UNAUTHORIZED);
    }
    const {
      name,
      description,
      rating,
      _id,
    } = req.body;
    Dessert.findOne({ _id })
      .then(Dessert => {
        Dessert.name = name || Dessert.name;
        Dessert.description = description || Dessert.description;
        Dessert.rating = rating || Dessert.rating;
        Dessert
          .save()
          .then(() => {
            res.sendStatus(STATUS_CODES.OK);
          })
          .catch(() => {
            res.sendStatus(STATUS_CODES.BAD_REQUEST);
          });
      })
      .catch(() => {
        res.sendStatus(STATUS_CODES.NOT_FOUND);
      });
  });

  router.post('/deleteDessert', (req, res) => {
    const token = req.body.token;

    if (!verifyToken(token)) {
        return res.sendStatus(STATUS_CODES.UNAUTHORIZED);
    }

    const isValid = verifyToken(token);

    if (!isValid) {
        return res.sendStatus(STATUS_CODES.UNAUTHORIZED);
    }

    Dessert.deleteOne({ _id: req.body._id })
      .then(result => {
        if (result.n < 1) {
          res.sendStatus(STATUS_CODES.NOT_FOUND);
        } else {
          res.sendStatus(STATUS_CODES.OK);
        }
      })
      .catch(() => {
        res.sendStatus(STATUS_CODES.BAD_REQUEST);
      });
  });

module.exports = router;
