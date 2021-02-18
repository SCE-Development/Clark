/* eslint-disable */

const express = require('express');
const router = express.Router();
const { GalleryImage, GalleryFace } = require('../models/GalleryFace');
const mongoose = require('mongoose');
const {
  checkIfTokenSent,
  checkIfTokenValid,
} = require('../util/token-functions');
const {
  OK,
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
} = require('../../util/constants').STATUS_CODES;
const addErrorLog = require('../util/logging-helpers');
const { membershipState } = require('../../../src/Enums');

router.post('/createAndAddFace', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (
    !checkIfTokenValid(req, membershipState.OFFICER) &&
    !checkIfTokenValid(req, membershipState.ADMIN)
  ) {
    return res.sendStatus(UNAUTHORIZED);
  }

  let newFace;

  try {
    newFace = new GalleryFace({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      top: req.body.top,
      left: req.body.left,
      width: req.body.width,
      height: req.body.height,
    });
  } catch (error) {
    return res.status(BAD_REQUEST).json(error);
  }

  GalleryFace.create(newFace, async (error, post) => {
    if (error) {
      return res.sendStatus(BAD_REQUEST);
    }

    const temp = await GalleryImage.findOne({ _id: req.body.id })
      .then((image) => {
        if (!image)
          return res.status(NOT_FOUND).send({ message: 'Image not found' });
        image.faces.push(newFace);
        image
          .save()
          .then((ret) => {
            return res
              .status(OK)
              .json({ ret, post, event: 'Image updated successfully' });
          })
          .catch((error) => {
            return res.status(BAD_REQUEST).send({
              error,
              message: 'Image was not updated',
            });
          });
      })
      .catch((error) => {
        return res
          .status(NOT_FOUND)
          .send({ error, message: 'Image not found' });
      });
  });
  return res;
});

router.post('/createImage', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (
    !checkIfTokenValid(req, membershipState.OFFICER) &&
    !checkIfTokenValid(req, membershipState.ADMIN)
  ) {
    return res.sendStatus(UNAUTHORIZED);
  }

  let newImage;
  try {
    newImage = new GalleryImage({
      name: req.body.name,
      faces: [],
    });
  } catch (error) {
    return res.status(BAD_REQUEST).json(error);
  }

  GalleryImage.create(newImage, (error, post) => {
    if (error) {
      // console.log('GI createNewImage: ', error);
      return res.sendStatus(BAD_REQUEST);
    }
    return res.status(OK).json(post);
  });
  return res.status(OK);
});

router.post('/getImageByName', (req, res) => {
  GalleryImage.findOne({ name: req.body.name })
    .then((image) => {
      if (!image) res.status(NOT_FOUND).send({ message: 'Image not found' });
      else res.status(OK).send(image);
    })
    .catch((error) => {
      res.status(BAD_REQUEST).send({ error, message: 'Error getting Image' });
    });
  return res;
});

router.post('/getImageByID', (req, res) => {
  GalleryImage.findOne({ _id: req.body.id })
    .then((image) => {
      if (!image) res.status(NOT_FOUND).send({ message: 'Image not found' });
      else res.status(OK).send(image);
    })
    .catch((error) => {
      res.status(BAD_REQUEST).send({ error, message: 'Error getting Image' });
    });
  return res;
});

router.post('/getFaceInformation', (req, res) => {
  GalleryFace.findOne({ _id: req.body.id })
    .then((face) => {
      if (!face) res.status(NOT_FOUND).send({ message: 'Face not found' });
      else res.status(OK).send(face);
    })
    .catch((error) => {
      res.status(BAD_REQUEST).send({ error, message: 'Error getting Face' });
    });
  return res;
});

router.post('/deleteFace', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (
    !checkIfTokenValid(req, membershipState.OFFICER) &&
    !checkIfTokenValid(req, membershipState.ADMIN)
  ) {
    return res.sendStatus(UNAUTHORIZED);
  }
  GalleryFace.deleteOne({ _id: req.body.id })
    .then((value) => {
      if (!value) res.status(NOT_FOUND).send({ message: 'Face not found' });
      else res.status(OK).json({ value, event: 'Face deleted' });
    })
    .catch((error) => {
      res.status(BAD_REQUEST).send({ error, message: 'Face deleting failed' });
    });
  return res;
});

router.post('/deleteImage', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (
    !checkIfTokenValid(req, membershipState.OFFICER) &&
    !checkIfTokenValid(req, membershipState.ADMIN)
  ) {
    return res.sendStatus(UNAUTHORIZED);
  }
  GalleryImage.deleteOne({ _id: req.body.id })
    .then((value) => {
      if (!value) res.status(NOT_FOUND).send({ message: 'Image not found' });
      else
        res.status(OK).json({ value, message: 'Image successfully deleted' });
    })
    .catch((error) => {
      res.status(BAD_REQUEST).send({ error, message: 'Image deleting failed' });
    });
  return res;
});

module.exports = router;
