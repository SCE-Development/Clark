const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json());
const {
  BAD_REQUEST,
  SERVER_ERROR,
  NOT_FOUND,
  OK,
  UNAUTHORIZED
} = require('../../util/constants').STATUS_CODES;
const membershipState = require('../../util/constants').MEMBERSHIP_STATE;
const { updateMembershipExpiration } = require('../util/userHelpers');
const { findVerifyPayment, rejectPayment, storePayment } = require('../util/membershipPaymentQueries.js');
const { decodeToken } = require('../util/token-functions.js');
const { membershipPayment = {} } = require('../../config/config.json');
const { API_KEY = 'TUFFANYCHAR' } = membershipPayment;
const crypto = require('crypto');
const { membershipConfirmationCode } = require('../util/emailHelpers');
const logger = require('../../util/logger');

router.post('/verifyMembership', async (req, res) => {
  const decoded = await decodeToken(req, membershipState.PENDING);
  if (decoded.status !== OK) {
    return res.sendStatus(decoded.status);
  }

  const { confirmationCode } = req.body;
  const userId = decoded.token._id;

  if (!confirmationCode) {
    return res.sendStatus(BAD_REQUEST);
  }

  const paymentDocument = await findVerifyPayment(confirmationCode, userId);
  if (paymentDocument === null){
    return res.sendStatus(SERVER_ERROR);
  }
  if (paymentDocument === false){
    return res.sendStatus(NOT_FOUND);
  }

  const paymentId = paymentDocument._id;
  const { amount } = paymentDocument;

  if (amount < 20){
    const rejected = await rejectPayment(paymentId);
    if (rejected === null){
      return res.sendStatus(SERVER_ERROR);
    }
    if (rejected === false){
      return res.sendStatus(NOT_FOUND);
    }
    return res.sendStatus(BAD_REQUEST);
  }

  let semestersToAdd = 0;
  if (amount >= 30) {
    semestersToAdd = 2;
  } else {
    semestersToAdd = 1;
  }

  const membershipUpdateResult = await updateMembershipExpiration(
    decoded.token._id,
    semestersToAdd
  );

  if (membershipUpdateResult === null) {
    return res.sendStatus(SERVER_ERROR);
  }
  if (membershipUpdateResult === false) {
    return res.status(NOT_FOUND).send('User not found.');
  }
  return res.sendStatus(OK);
});

router.post('/storePayment', async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    return res.status(BAD_REQUEST).send('API key missing from request.');
  }
  if (apiKey !== API_KEY) {
    return res.status(UNAUTHORIZED).send('Invalid API key.');
  }
  const { memberEmail, amount, venmoPaymentDetails } = req.body;
  const required = [
    { value: memberEmail, title: 'Member email', },
    { value: amount, title: 'Valid payment amount', },
    { value: venmoPaymentDetails, title: 'Venmo payment details', },
  ];
  const missingValue = required.find(({ value }) => !value);
  if (missingValue) {
    return res.status(BAD_REQUEST).send(`${missingValue.title} missing from request`);
  }

  const confirmationCode = crypto.randomBytes(4).toString('hex').toUpperCase();
  const newPayment = {
    userId: null,
    confirmationCode,
    amount,
    venmoPaymentDetails,
  };
  const storeResult = await storePayment(newPayment);
  if (!storeResult) {
    return res.sendStatus(SERVER_ERROR);
  }
  const sendEmail = await membershipConfirmationCode(confirmationCode, memberEmail);
  if (!sendEmail) {
    logger.error('Failed to send membership confirmation email to:', memberEmail);
  }
  return res.sendStatus(OK);
});

module.exports = router;
