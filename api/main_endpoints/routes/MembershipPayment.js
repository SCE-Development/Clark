const express = require('express');
const router = express.Router();

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
const { decodeToken } = require('../../util/auth');

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

  try {
    const paymentDocument = await findVerifyPayment(confirmationCode, userId);

    if (!paymentDocument) {
      return res.sendStatus(NOT_FOUND);
    }
    const paymentId = paymentDocument._id;
    const { amount } = paymentDocument;
    let accessLevel;
    let membershipValidUntil;

    if (amount >= 30) {
      accessLevel = membershipState.MEMBER;
      membershipValidUntil = getMemberExpirationDate(2);
    } else if (amount >= 20) {
      accessLevel = membershipState.MEMBER;
      membershipValidUntil = getMemberExpirationDate(1);
    } else {
      await rejectPayment(paymentId);
      return res.sendStatus(BAD_REQUEST);
    }

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

  } catch (error){
    return res.sendStatus(SERVER_ERROR);
  }
});
