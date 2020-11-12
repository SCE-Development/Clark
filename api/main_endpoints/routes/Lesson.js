const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');
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
const addErrorLog = require ('../util/logging-helpers');

router.get('/getLessons', (req, res) => {
  Lesson.find()
    .then(items => res.status(OK).send(items))
    .catch(error => {
      const info = {
        errorTime: new Date(),
        apiEndpoint: 'Lesson/getLessons',
        errorDescription: error
      };
      addErrorLog(info);
      res.status(BAD_REQUEST).send({ error, message: 'Getting lesson failed' });
    });
});

router.post('/createLesson', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  const newLesson = new Lesson({
    title: req.body.title,
    link: req.body.link
  });

  Lesson.create(newLesson, (error, post) => {
    if (error) {
      return res.sendStatus(BAD_REQUEST);
    }
    return res.json(post);
  });
});

router.post('/editLesson', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  const {
    title,
    link
  } = req.body;
  Lesson.findOne({ _id: req.body.id })
    .then(lesson => {
      lesson.title = title || lesson.title;
      lesson.link = link || lesson.link;
      lesson
        .save()
        .then(ret => {
          res.status(OK).json({ ret, lesson: 'lesson updated successfully' });
        })
        .catch(error => {
          res.status(BAD_REQUEST).send({
            error,
            message: 'lesson was not updated'
          });
        });
    })
    .catch(error => {
      res.status(NOT_FOUND).send({ error, message: 'lesson not found' });
    });
});

router.post('/deleteLesson', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  Lesson.deleteOne({ _id: req.body.id })
    .then(lesson => {
      res.status(OK).json({ lesson: 'lesson successfully deleted' });
    })
    .catch(error => {
      res.status(BAD_REQUEST)
        .send({ error, message: 'deleting lesson failed' });
    });
});

module.exports = router;
