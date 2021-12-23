const express = require("express");
const router = express.Router();
const Dessert = require("../models/Dessert");
const {
  checkIfTokenSent,
  checkIfTokenValid,
} = require("../../util/token-functions");
const { OK, BAD_REQUEST, UNAUTHORIZED, FORBIDDEN, NOT_FOUND } =
  require("../../util/constants").STATUS_CODES;
module.exports = router;

router.get("/getDesserts", (req, res) => {
  Dessert.find()
    .then((items) => res.status(OK).send(items))
    .catch((error) => {
      res.sendStatus(BAD_REQUEST);
    });
});

router.post("/createDessert", (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req, membershipState.OFFICER)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  const newEvent = new Dessert({
    title: req.body.title,
    description: req.body.description,
    rating: req.body.rating,
  });

  Dessert.create(newEvent, (error, post) => {
    if (error) {
      return res.sendStatus(BAD_REQUEST);
    } else {
      return res.json(post);
    }
  });
});

router.post("/editDessert", (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req, membershipState.OFFICER)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  const { title, description, rating, _id } = req.body;
  Dessert.findOne({ _id })
    .then((Dessert) => {
      Dessert.title = title || Dessert.title;
      Dessert.description = description || Dessert.description;
      Dessert.rating = rating || Dessert.rating;
      Dessert.save()
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

router.delete("/deleteDessert", (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req, membershipState.OFFICER)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  Dessert.deleteOne({ _id: req.body._id })
    .then((result) => {
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
