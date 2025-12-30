const express = require ('express');
const router = express.Router();
const { OK, NOT_FOUND } = require('../../util/constants').STATUS_CODES;

//sample images (all from openverse.org) for now!! 
const imageUrls = [
    {url: "https://live.staticflickr.com/14/19329415_09b1eae0e8_b.jpg", label: "2025 internship"},
    {url: "https://live.staticflickr.com/2182/2377582173_89e0ca2f83_b.jpg", label: "empty room"},
    {url: "https://live.staticflickr.com/4045/4339898436_8283d8be54_b.jpg", label: "full room"},
    {url: "https://live.staticflickr.com/102/298812490_b57db6f58b_b.jpg", label: "decorating room"},
    {url: "https://live.staticflickr.com/204/468095839_bba3fc0e30_b.jpg", label: "office"},
    {url: "https://live.staticflickr.com/7208/14133744683_ae04e8f1e4_b.jpg", label: "dev team collaboration"},
];

const getRandomImage = () => {
    return imageUrls[Math.floor(Math.random() * imageUrls.length)];
}

router.get('/image', (req, res) => {
    if(imageUrls.length === 0) return res.sendStatus(NOT_FOUND);
    res.status(OK).send(getRandomImage().url);
});

module.exports = router;