const express = require('express');
const router = express.Router();
const Dessert = require("../models/Dessert")
const {
    OK, // 200
    SERVER_ERROR,
    UNAUTHORIZED, // 401
    FORBIDDEN, // 403
    NOT_FOUND,// 404
} = require('../../util/constants').STATUS_CODES;
const membershipState = require('../../util/constants').MEMBERSHIP_STATE;

const {
    checkIfTokenSent,
    checkIfTokenValid,
    decodeToken,
} = require('../../main_endpoints/util/token-functions');
const { MEMBERSHIP_STATE } = require('../../util/constants');


// get all desserts
router.get("/getDesserts", (req, res) => {
    Dessert.find().then(items => res.status(OK).send(items)).catch(error => res.sendStatus(BAD_REQUEST));
})

// admin only here
function verifyToken(req, res, next) {
    if (!checkIfTokenSent(req)) { return res.sendStatus(FORBIDDEN); }
    if (!checkIfTokenValid(req)) { return res.sendStatus(UNAUTHORIZED); }
    next()
}

// create a new dessert
router.post("/createDessert", verifyToken, (req, res) => {

    // extract the rating
    const { rating } = req.body;
    const numberSent = !Number.isNaN(Number(rating));

    // create a new Dessert schema with the stuff sent to server
    const newEvent = new Dessert({
        title: req.body.title,
        description: req.body.description,
        rating: numberSent ? Number(rating) : undefined,
    });
    Dessert.create(newEvent, (error, post) => {
        if (error) { return res.sendStatus(BAD_REQUEST); }
        else { return res.json(post); }
    })
});

// edit dessert
router.post("/editDessert", verifyToken, (req, res) => {
    const { title, description, rating, _id, } = req.body;
    Dessert.findOne({ _id }).then(Dessert => {
        Dessert.title = title || Dessert.title;
        Dessert.description = description || Dessert.description;
        Dessert.rating = rating || Dessert.rating;
        Dessert.save().then(() => res.sendStatus(OK)).catch(() => res.sendStatus(BAD_REQUEST))
    }).catch(() => res.sendStatus(NOT_FOUND))
})

// delete dessert
router.post("/deleteDessert", verifyToken, (req, res) => {
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