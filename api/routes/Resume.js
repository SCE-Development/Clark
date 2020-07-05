const express = require("express");
const router = express.Router();
const ResumeForm = require("../models/ResumeForm");
const settings = require("../util/settings");
const logger = require(`${settings.util}/logger`);

const {
  OK,
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
} = require("../constants").STATUS_CODES;
const addErrorLog = require("../util/logging-helpers");

router.post("/ResumeForm", (req, res) => {
  console.log("hello");
});
