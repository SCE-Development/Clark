const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json());
const {
  BAD_REQUEST,
  SERVER_ERROR,
  NOT_FOUND,
  OK,
  UNAUTHORIZED,
  TOO_MANY_REQUESTS
} = require('../../util/constants').STATUS_CODES;
const membershipState = require('../../util/constants').MEMBERSHIP_STATE;
const { updateMembershipDetails } = require('../util/userHelpers');
const {
  findVerifyPayment,
  storePayment,
  requestDoorCode
} = require('../util/membershipPaymentQueries.js');
const { decodeToken } = require('../util/token-functions.js');
const { membershipPayment = {} } = require('../../config/config.json');
const { API_KEY = 'GO_AWAY_LOL' } = membershipPayment;
const crypto = require('crypto');
const { membershipConfirmationCode } = require('../util/emailHelpers');
const logger = require('../../util/logger');
const AuditLogActions = require('../util/auditLogActions');
const AuditLog = require('../models/AuditLog');

const attemptCount = new Map();
const MAX_ATTEMPTS = 5;


router.post('/verifyMembership', async (req, res) => {
  const decoded = await decodeToken(req, membershipState.PENDING);
  if (decoded.status !== OK) {
    return res.sendStatus(decoded.status);
  }

  const { confirmationCode } = req.body;
  const userId = decoded.token._id;
  const attempts = attemptCount.get(userId) ?? 0;

  if (attempts >= MAX_ATTEMPTS){
    logger.error(`User ${userId} has made too many verification attempts.`);
    return res.status(TOO_MANY_REQUESTS).json({
      remainingAttempts: 0
    });
  }

  if (!confirmationCode) {
    logger.error('Confirmation code missing from verifyMembership request');
    return res.status(BAD_REQUEST).send('Confirmation code missing from request.');
  }

  const paymentDocument = await findVerifyPayment(confirmationCode, userId);
  if (!paymentDocument) {
    attemptCount.set(userId, attempts + 1);
    logger.error('Error verifying payment for user:', userId);
    return res.status(NOT_FOUND).json({
      remainingAttempts: MAX_ATTEMPTS - (attempts + 1)
    });
  }

  const { amount } = paymentDocument;
  const semestersToAdd = amount >= 30 ? 2 : 1;

  let doorCode = null;
  if (membershipPayment.DCD_ENABLED) {
    doorCode = await requestDoorCode();
    if (!doorCode) {
      logger.error('Error requesting door code for user:', userId);
    }
  } else {
    logger.info('Door code distribution disabled, skipping door code request for user:', userId);
  }

  const membershipUpdateResult = await updateMembershipDetails(
    decoded.token._id,
    semestersToAdd,
    doorCode
  );

  if (!membershipUpdateResult) {
    logger.error('Error updating membership expiration for user:', decoded.token._id);
    return res.status(SERVER_ERROR).send('Error updating membership expiration.');
  }

  attemptCount.delete(userId);
  logger.info('Membership verified and updated for user:', decoded.token._id);
  AuditLog.create({
    userId: decoded.token._id,
    action: AuditLogActions.VERIFY_MEMBERSHIP,
    details: { semestersToAdd },
  });
  return res.status(OK).send('Membership verified successfully.');
});

router.post('/storePayment', async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    return res.status(BAD_REQUEST).send('API key missing from request.');
  }
  if (apiKey !== API_KEY) {
    return res.status(UNAUTHORIZED).send('Invalid API key.');
  }
  const { payerEmail, amount, payerName, note, transactionId } = req.body;
  const required = [
    { value: payerEmail, title: 'Payer email', },
    { value: amount, title: 'Valid payment amount', },
    { value: payerName, title: 'Payer name', },
    { value: note, title: 'Payment note', },
    { value: transactionId, title: 'Venmo transaction ID', },
  ];
  const missingValue = required.find(({ value }) => !value);
  if (missingValue) {
    return res.status(BAD_REQUEST).send(`${missingValue.title} missing from request`);
  }

  const confirmationCode = crypto.randomBytes(4).toString('hex').toUpperCase();
  const newPayment = {
    confirmationCode,
    amount,
    payerName,
    note,
    transactionId,
  };
  if (!await storePayment(newPayment)) {
    return res.status(SERVER_ERROR).send('Error storing payment.');
  }
  if (!await membershipConfirmationCode(confirmationCode, payerEmail)) {
    logger.error('Failed to send membership confirmation email to:', payerEmail);
    return res.status(SERVER_ERROR).send('Error sending confirmation email.');
  }
  return res.status(OK).send('Payment stored successfully.');
});

module.exports = router;
