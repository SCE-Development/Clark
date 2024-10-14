const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const {
  OK,
  BAD_REQUEST,
  NOT_FOUND
} = require('../../util/constants').STATUS_CODES;

router.post('/createFood', (req, res) => {
  const { price, quantity } = req.body;
  const isValidNumber = (value) => {
    return !Number.isNaN(Number(value));
  }

  const newFood = new Food({
    name: req.body.name,
    photo: req.body.photo,
    price: isValidNumber(price) ? Number(price) : undefined,
    quantity: isValidNumber(quantity) ? Number(quantity) : undefined,
    expiration: req.body.expiration,
  });

  Food.create(newFood)
    .then((post) => {
      return res.json(post);
    })
    .catch(
      (error) => res.sendStatus(BAD_REQUEST)
    );
});

router.get('/getFoods', (req, res) => {
  Food.find()
    .then(items => res.status(OK).send(items))
    .catch(error => {
      res.sendStatus(BAD_REQUEST);
    });

})

router.post('/editFood', (req, res) => {
  const {
    name,
    photo,
    price,
    quantity,
    expiration,
    _id,
  } = req.body;

  Food.findOne({ _id })
    .then(Food => {
      Food.name = name || Food.name;
      Food.photo = photo || Food.photo;
      Food.price = price || Food.price;
      Food.quantity = quantity || Food.quantity;
      Food.expiration = expiration || Food.expiration;
      Food
        .save()
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

router.post('/deleteFood', (req, res) => {
  Food.deleteOne({ _id: req.body._id })
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