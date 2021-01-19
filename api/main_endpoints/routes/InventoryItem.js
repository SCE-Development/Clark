const express = require('express');
const router = express.Router();
const InventoryItem = require('../models/InventoryItem');
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
const { membershipState } = require('../Enums');

router.get('/getItems', (req, res) => {
  const category = req.body.category ? { category: req.body.category } : {};
  InventoryItem.find(category).then(items => res.status(OK).send(items));
});

router.post('/editItem', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req, membershipState.OFFICER)) {
    return res.sendStatus(UNAUTHORIZED);
  }

  const { name, price, stock, category, description, picture } = req.body;

  InventoryItem.findOne({ name: req.body.name })
    .then(item => {
      item.name = name || item.name;
      item.price = price || item.price;
      item.stock = stock || item.stock;
      item.category = category || item.category;
      item.description = description || item.description;
      item.picture = picture || item.picture;
      item
        .save()
        .then(ret => {
          res
            .status(OK)
            .json({ ret, item: 'Inventory item updated successfully' });
        })
        .catch(error => {
          res.status(BAD_REQUEST).send({
            error,
            message: 'Inventory item was not updated'
          });
        });
    })
    .catch(error => {
      res.status(NOT_FOUND).send({ error, message: 'item not found' });
    });
});

router.post('/addItem', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req, membershipState.OFFICER)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  const newItem = new InventoryItem({
    name: req.body.name,
    price: req.body.price,
    stock: req.body.stock,
    category: req.body.category,
    description: req.body.description,
    picture: req.body.picture
  });

  InventoryItem.create(newItem, (error, post) => {
    if (error) {
      return res.sendStatus(BAD_REQUEST);
    }
    return res.json(post);
  });
});

router.post('/deleteItem', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req, membershipState.OFFICER)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  InventoryItem.deleteOne({ name: req.body.name }, (error, form) => {
    if (error) {
      const info = {
        errorTime: new Date(),
        apiEndpoint: 'InventoryItem/deleteItem',
        errorDescription: error
      };
      addErrorLog(info);
      return res.sendStatus(BAD_REQUEST);
    }
    if (form.n < 1) {
      return res.sendStatus(NOT_FOUND);
    } else {
      return res.status(OK).send({ message: `${req.body.name} was deleted.` });
    }
  });
});

module.exports = router;
