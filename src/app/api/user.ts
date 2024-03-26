'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../util/passport')(passport);
const User = require('../models/User.js');
const {
  getMemberExpirationDate,
  hashPassword,
} = require('../util/userHelpers');
const { checkDiscordKey } = require('../../util/token-verification');
const {
  checkIfTokenSent,
  checkIfTokenValid,
  decodeToken,
} = require('../util/token-functions');
const {
  OK,
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  CONFLICT,
  SERVER_ERROR,
} = require('../../util/constants').STATUS_CODES;
const {
  discordApiKeys
} = require('../../config/config.json');
const membershipState = require('../../util/constants').MEMBERSHIP_STATE;
const discordConnection = require('../util/discord-connection');

const discordRedirectUri = process.env.DISCORD_REDIRECT_URI ||
  'http://localhost:8080/api/user/callback';

const {sendUnsubscribeEmail} = require('../util/emailHelpers');

const ROWS_PER_PAGE = 20;

module.exports = router;
