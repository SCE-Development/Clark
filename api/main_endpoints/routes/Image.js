const express = require ('express');
const router = express.Router();
const { OK, NOT_FOUND } = require('../../util/constants').STATUS_CODES;

const imageUrls = [
  {url: 'https://live.staticflickr.com/2182/2377582173_89e0ca2f83_b.jpg', alt: 'empty room'},
  {url: 'https://raw.githubusercontent.com/SCE-Development/Clark/93b422f177118942b725bbe090ea8d50abd3c1c3/public/2022intern.jpg', alt: '2022intern'},
  {url: 'https://raw.githubusercontent.com/SCE-Development/Clark/93b422f177118942b725bbe090ea8d50abd3c1c3/public/2023_spring.jpg', alt: '2023_spring'},
  {url: 'https://raw.githubusercontent.com/SCE-Development/Clark/93b422f177118942b725bbe090ea8d50abd3c1c3/public/2025intern.jpg', alt: '2025 intern'},
  {url: 'https://raw.githubusercontent.com/SCE-Development/Clark/93b422f177118942b725bbe090ea8d50abd3c1c3/public/4monitor.jpg', alt: 'using 4 monitors in sce'},
  {url: 'https://raw.githubusercontent.com/SCE-Development/Clark/93b422f177118942b725bbe090ea8d50abd3c1c3/public/alumni_visit.jpg', alt: 'alumni visit'},
  {url: 'https://raw.githubusercontent.com/SCE-Development/Clark/93b422f177118942b725bbe090ea8d50abd3c1c3/public/alumni_visit2.jpg', alt: 'alumni visit'},
  {url: 'https://raw.githubusercontent.com/SCE-Development/Clark/93b422f177118942b725bbe090ea8d50abd3c1c3/public/cleezy_demo.jpg', alt: 'cleezy_demo'},
  {url: 'https://raw.githubusercontent.com/SCE-Development/Clark/93b422f177118942b725bbe090ea8d50abd3c1c3/public/companytour.jpg', alt: 'companytour'},
  {url: 'https://raw.githubusercontent.com/SCE-Development/Clark/93b422f177118942b725bbe090ea8d50abd3c1c3/public/dragon.jpg', alt: 'dragon'},
  {url: 'https://raw.githubusercontent.com/SCE-Development/Clark/93b422f177118942b725bbe090ea8d50abd3c1c3/public/endofyear.jpg', alt: 'endofyear'},
  {url: 'https://raw.githubusercontent.com/SCE-Development/Clark/93b422f177118942b725bbe090ea8d50abd3c1c3/public/game.jpg', alt: 'game'},
  {url: 'https://raw.githubusercontent.com/SCE-Development/Clark/93b422f177118942b725bbe090ea8d50abd3c1c3/public/hackathon.jpg', alt: 'hackathon'},
  {url: 'https://raw.githubusercontent.com/SCE-Development/Clark/93b422f177118942b725bbe090ea8d50abd3c1c3/public/hackinit.jpg', alt: 'working in the hardware lab'},
  {url: 'https://raw.githubusercontent.com/SCE-Development/Clark/93b422f177118942b725bbe090ea8d50abd3c1c3/public/kahoot.jpg', alt: 'kahoot'},
  {url: 'https://raw.githubusercontent.com/SCE-Development/Clark/93b422f177118942b725bbe090ea8d50abd3c1c3/public/lego.jpg', alt: 'lego'},
  {url: 'https://raw.githubusercontent.com/SCE-Development/Clark/93b422f177118942b725bbe090ea8d50abd3c1c3/public/piza.jpg', alt: 'pizza'},
  {url: 'https://raw.githubusercontent.com/SCE-Development/Clark/93b422f177118942b725bbe090ea8d50abd3c1c3/public/scemakescoffee.jpg', alt: 'sce makes coffee'},
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
