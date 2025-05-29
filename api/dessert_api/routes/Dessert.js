const express = require('express');
const router = express.Router();
const Dessert = require("../models/Dessert")
const {
    OK,
    SERVER_ERROR,
    UNAUTHORIZED
} = require('../../util/constants').STATUS_CODES;

// create a new dessert
router.post("/createDessert", (req, res) => {

    // extract the rating
    const { rating } = req.body;
    const numberSent = !Number.isNaN(Number(rating));

    // create a new Dessert schema with the stuff sent to server
    const newEvent = new Dessert({
        title: req.body.title,
        description: req.body.description,
        lifespan: numberSent ? Number(rating) : undefined,
    });
    Dessert.create(newEvent, (error, post) => {
        if (error) { return res.sendStatus(BAD_REQUEST); }
        else { return res.json(post); }
    })
});

// get all desserts
router.get("/getDesserts", (req, res) => {
    Dessert.find().then(items => res.status(OK).send(items)).catch(error => res.sendStatus(BAD_REQUEST));
})

// edit dessert
router.post("/editDessert", (req, res) => {
    const { title, description, rating, _id, } = req.body;
    Dessert.findOne({ _id }).then(Dessert => {
        Dessert.title = title || Dessert.title;
        Dessert.description = description || Dessert.description;
        Dessert.rating = rating || Dessert.rating;
        Dessert.save().then(() => res.sendStatus(OK)).catch(() => res.sendStatus(BAD_REQUEST))
    }).catch(() => res.sendStatus(NOT_FOUND))
})

// delete dessert
router.post("/deleteDessert", (req, res) => {
    const { _id } = req.body
    Dessert.deleteOne({ _id }).then(
        (result) => {
            if (result.n < 1) {
                res.sendStatus(NOT_FOUND)
            } else {
                res.sendStatus(OK)
            }
        }

    ).catch(() => res.sendStatus(BAD_REQUEST))
})

module.exports = router