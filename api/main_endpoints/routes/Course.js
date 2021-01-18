const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const Lesson = require("../models/Course");
const {
  checkIfTokenSent,
  checkIfTokenValid
} = require("../util/token-functions");
const {
  OK,
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND
} = require("../../util/constants").STATUS_CODES;
const addErrorLog = require("../util/logging-helpers");
const mongoose = require("mongoose");

router.get("/getCourses", (req, res) => {
  Course.find()
    .then(items => res.status(OK).send(items))
    .catch(error => {
      const info = {
        errorTime: new Date(),
        apiEndpoint: "Course/getCourses",
        errorDescription: error
      };
      addErrorLog(info);
      res.status(BAD_REQUEST).send({ error, message: "Getting course failed" });
    });
});

router.post("/createCourse", (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }

  const createCourse = new Course({
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    lessons: [],
    link: req.body.link
  });

  Course.create(createCourse, (error, post) => {
    if (error) {
      return res.sendStatus(BAD_REQUEST);
    }
    return res.json(post);
  });
});

router.post("/editCourse", (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  const { title, author, description, lessons, link } = req.body;

  const newLesson = new Lesson({
    _id: new mongoose.Types.ObjectId()
  })

  Course.findOne({ _id: req.body.id })
    .then(course => {
      course.title = title || course.title;
      course.author = author || course.author;
      course.description = description || course.description;
      course.lessons.push(newLesson._id);
      // course.lessons = lessons || course.lessons;
      course.link = link || course.link;
      course
        .save()
        .then(ret => {
          res.status(OK).json({ ret, course: "course updated successfully" });
        })
        .catch(error => {
          res.status(BAD_REQUEST).send({
            error,
            message: "course was not updated"
          });
        });
    })
    .catch(error => {
      res.status(NOT_FOUND).send({ error, message: "course not found" });
    });
});

router.post("/deleteCourse", (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  Course.deleteOne({ _id: req.body.id })
    .then(course => {
      res.status(OK).json({ course: "course successfully deleted" });
    })
    .catch(error => {
      res
        .status(BAD_REQUEST)
        .send({ error, message: "deleting course failed" });
    });
});

module.exports = router;
