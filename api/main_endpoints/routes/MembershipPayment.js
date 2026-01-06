const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json());

const {
  BAD_REQUEST,
  SERVER_ERROR,
  NOT_FOUND,
  OK,
} = require('../../util/constants').STATUS_CODES;
const membershipState = require('../../util/constants').MEMBERSHIP_STATE;
const User = require('../models/User');
const { getMemberExpirationDate } = require('../util/userHelpers');
const { findVerifyPayment, rejectPayment } = require('../util/membershipPaymentQueries');
const { decodeToken } = require('../util/token-functions.js');

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
  let membershipValidUntil;

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

  if (amount >= 30) {
    membershipValidUntil = getMemberExpirationDate(2);
  } else {
    membershipValidUntil = getMemberExpirationDate(1);
  }

  const accessLevel = membershipState.MEMBER;
  await User.updateOne(
    { _id: userId },
    {
      $set: {
        accessLevel,
        membershipValidUntil
      }
    }
  );
  return res.sendStatus(OK);
});
