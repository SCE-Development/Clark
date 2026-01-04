const express = require ('express');
const router = express.Router();
const { OK, NOT_FOUND } = require('../../util/constants').STATUS_CODES;

// sample images (all from openverse.org) for now!!
const imageUrls = [
  {url: 'https://live.staticflickr.com/14/19329415_09b1eae0e8_b.jpg', alt: '2025 internship'},
  {url: 'https://live.staticflickr.com/2182/2377582173_89e0ca2f83_b.jpg', alt: 'empty room'},
  {url: 'https://live.staticflickr.com/4045/4339898436_8283d8be54_b.jpg', alt: 'full room'},
  {url: 'https://live.staticflickr.com/102/298812490_b57db6f58b_b.jpg', alt: 'decorating room'},
  {url: 'https://live.staticflickr.com/204/468095839_bba3fc0e30_b.jpg', alt: 'office'},
  {url: 'https://live.staticflickr.com/7208/14133744683_ae04e8f1e4_b.jpg', alt: 'dev team collaboration'},
];

const getRandomImage = () => {
  if(imageUrls.length === 0) return null;
  return imageUrls[Math.floor(Math.random() * imageUrls.length)];
};

router.get('/Homepage', (req, res) => {
  const image = getRandomImage();
  if(!image) return res.sendStatus(NOT_FOUND);
  res.status(OK).send(image);
});

module.exports = router;
