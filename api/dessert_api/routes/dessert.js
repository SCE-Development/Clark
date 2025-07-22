const express = require('express');
const router = express.Router();
const Dessert = require('../models/dessert');
const {
  OK,
  BAD_REQUEST,
  NOT_FOUND
} = require('../../util/constants').STATUS_CODES;

router.post('/createDessert', (req, res) => {
  console.log('not working', req.body);
  const { rating } = req.body;
  const numberSent = !Number.isNaN(Number(rating));

  const newEvent = new Dessert({
    title: req.body.title,
    description: req.body.description,
    rating: numberSent ? Number(rating) : undefined,
  });

  Dessert.create(newEvent)
    .then((post) => {
      return res.json(post);
    })
    .catch(
      (error) => {
        console.log('CREATE DIDNT WORK', error)
        res.sendStatus(BAD_REQUEST)
      }
    );
});

router.get('/getDesserts', (req, res) => {
  Dessert.find()
    .then(items => res.status(OK).send(items))
    .catch(error => {
      res.sendStatus(BAD_REQUEST);
    });
});

router.post('/editDessert', (req, res) => {
  const {
    title,
    description,
    rating,
    _id,
  } = req.body;

  Dessert.findOne({ _id })
    .then(dessert => {
      if (!dessert) return res.sendStatus(NOT_FOUND);

      dessert.title = title || dessert.title;
      dessert.description = description || dessert.description;
      dessert.rating = rating !== undefined ? Number(rating) : dessert.rating;

      dessert.save()
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

router.post('/deleteDessert', (req, res) => {
  Dessert.deleteOne({ _id: req.body._id })
    .then(result => {
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

module.exports = router;
