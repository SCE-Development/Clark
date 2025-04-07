const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const { isValidNumber } = require('../../util/ValidNumber');
const {
  OK,
  BAD_REQUEST,
  NOT_FOUND
} = require('../../util/constants').STATUS_CODES;

router.post('/createFood', async (req, res) => {
  const { price, quantity } = req.body;

  const newFood = new Food({
    name: req.body.name,
    type: req.body.type,
    photo: req.body.photo,
    price: isValidNumber(price) ? Number(price) : undefined,
    quantity: isValidNumber(quantity) ? Number(quantity) : undefined,
    expiration: req.body.expiration,
  });

  try {
    const post = await Food.create(newFood);
    return res.json(post);
  } catch(error) {
    return res.sendStatus(BAD_REQUEST);
  }
});

router.get('/getFoods', async (req, res) => {
  // Food.find()
  //   .then(items => res.status(OK).send(items))
  //   .catch(error => {
  //     res.sendStatus(BAD_REQUEST);
  //   });

  try {
    const items = await Food.find();
    return res.status(OK).send(items)
  } catch(error) {
    return res.sendStatus(BAD_REQUEST);
  }
})

router.post('/editFood', async (req, res) => {
  const {
    name,
    type,
    photo,
    price,
    quantity,
    expiration,
    _id,
  } = req.body;

  try {
    const food = await Food.findOne({ _id });
    if (!food) {
      return res.sendStatus(NOT_FOUND);
    }
    
    food.name = name || food.name;
    food.type = type || food.type;
    food.photo = photo || food.photo;
    food.price = price || food.price;
    food.quantity = quantity || food.quantity;
    food.expiration = expiration || food.expiration;

    await food.save();
    return res.sendStatus(OK);
  } catch (error) {
    return res.sendStatus(BAD_REQUEST);
  }
});

router.post('/deleteFood', async (req, res) => {
  try {
    const result = await Food.deleteOne({ _id: req.body._id });
    if (result.n < 1) {
      return res.sendStatus(NOT_FOUND);
    } else {
      return res.sendStatus(OK);
    }
  } catch (error) {
    return res.sendStatus(BAD_REQUEST);
  }
});

module.exports = router;