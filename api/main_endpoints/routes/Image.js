const express = require ('express');
const router = express.Router();
const { OK, NOT_FOUND } = require('../../util/constants').STATUS_CODES;

const imageUrls = [
  {url: 'https://live.staticflickr.com/2182/2377582173_89e0ca2f83_b.jpg', alt: 'empty room'},
  {url: 'https://github.com/user-attachments/assets/92eecd21-1217-4d6d-b18a-bafc95083b51', alt: '  sce room with a dragon'},
  {url: 'https://github.com/user-attachments/assets/a87670c1-16fd-4940-993f-a57c86cc1527', alt: 'internship celebration'},
  {url: 'https://github.com/user-attachments/assets/51e51f22-2301-4e08-8c47-446188cc720c', alt: 'internship game night'},
  {url: 'https://github.com/user-attachments/assets/729fcbaf-5c1a-4bc2-8ceb-e5b3e7920428', alt: 'hackathon'},
  {url: 'https://github.com/user-attachments/assets/575715b1-ecce-4f03-a8d8-a11c66db0633', alt: 'sce sells coffee in the room'},
  {url: 'https://github.com/user-attachments/assets/6619e37d-babe-4416-8750-c04f6c8e01c6', alt: 'company tour'},
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
