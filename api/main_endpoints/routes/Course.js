const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
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
const { isValidObjectId } = require('mongoose');

router.get('/getCourses', (req, res) => {
  Course.find()
    .then(items => res.status(OK).send(items))
    .catch(error => {
      const info = {
        errorTime: new Date(),
        apiEndpoint: 'Course/getCourses',
        errorDescription: error
      };
      addErrorLog(info);
      res.status(BAD_REQUEST).send({ error, message: 'Getting course failed' });
    });
});

router.post('/createCourse', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  const newCourse = new Course({
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    imageURL: req.body.imageURL
  });

  Course.create(newCourse, (error, post) => {
    if (error) {
      return res.sendStatus(BAD_REQUEST);
    }
    return res.json(post);
  });
});

router.post('/editCourse', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  const {
    _id,
    title,
    author,
    description,
    imageURL,
    lessons
  } = req.body;
  Course.findOne({ _id })
    .then(course => {
      course.title = title || course.title;
      course.author = author || course.author;
      course.description = description || course.description;
      course.imageURL = imageURL || course.imageURL;
      course.lessons = lessons || course.lessons;
      course
        .save()
        .then(ret => {
          res.status(OK).json({ ret, course: 'course updated successfully' });
        })
        .catch(error => {
          res.status(BAD_REQUEST).send({
            error,
            message: 'course was not updated'
          });
        });
    })
    .catch(error => {
      res.status(NOT_FOUND).send({ error, message: 'course not found' });
    });
});

router.post('/deleteCourse', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  Course.deleteOne({ _id: req.body.id })
    .then(course => {
      res.status(OK).json({ course: 'course successfully deleted' });
    })
    .catch(error => {
      res.status(BAD_REQUEST)
        .send({ error, message: 'deleting course failed' });
    });
});

router.post('/editLesson', (req, res) => {
  const {
    courseId,
    newLessons
  } = req.body;

  Course.updateOne(
    { _id:courseId },
    { $set: { lessons: newLessons }})
    .then(ret => {
      res.status(OK).json({ ret, course: 'course updated successfully' });
    })
    .catch(error => {
      res.status(BAD_REQUEST).send({
        error,
        message: 'Lesson was not updated'
      });
    });
});

router.get('/getLessons', (req, res) => {
  const { courseId } = req.query;
  
  Course.find({ _id:courseId })
    .then(items => res.status(OK).send(items[0].lessons))
    .catch(error => {
      const info = {
        errorTime: new Date(),
        apiEndpoint: 'course/getLessons',
        errorDescription: error
      };
      addErrorLog(info);
      res.status(BAD_REQUEST).send({ error, message: 'Getting lesson failed' });
    });
});

module.exports = router;
