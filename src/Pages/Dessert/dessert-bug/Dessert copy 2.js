/*defining our HTTP request handlers 
for mongodb to create/read/update/delete data

predefined vars and libs
this imports express and the dessert schema in models/dessert.js
so we can interact with the dessert collection 
*/

const express = require('express');
const router = express.Router();
const Dessert = require('../models/Dessert');
const {
  OK,
  BAD_REQUEST,
  NOT_FOUND
} = require('../../util/constants').STATUS_CODES;


//creating data 
/* it takes a http post request and adds data 
from the request into mongoDB.

data is part of req.body and we return the added document
if insert was successful or 400 if not
*/

router.post('/createDessert', (req, res) => {
  const { rating } = req.body;
  const validRating = !Number.isNaN(Number(rating));

  const newEvent = new Dessert({
    title: req.body.title,
    description: req.body.description,
    rating: validRating ? Number(rating) : undefined,
  });

  Dessert.create(newEvent)
    .then((post) => {
      return res.json(post);
    })
    .catch(
      (error) => res.sendStatus(BAD_REQUEST)
    );
});

//reading data
/*take http get request and return all docs in the animal collection
*/

router.get('/getDessert', (req, res) => {
  Dessert.find()
    .then(items => res.status(OK).send(items))
    .catch(error => {
      res.sendStatus(BAD_REQUEST);
    });
});


//update data
/* we use the id of an ecisting doc to UPDATE
the data
*/

router.post('/editDessert', (req, res) => {
  const {
    title,
    description,
    rating,
    _id,
  } = req.body;

   console.log('_id:', _id); 

  Dessert.findOne({ _id })
    .then(Dessert => {
      Dessert.title = title || Dessert.title;
      Dessert.description = description || Dessert.description;
      Dessert.rating = rating || Dessert.rating;
      Dessert
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

//delete
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

module.exports = router



