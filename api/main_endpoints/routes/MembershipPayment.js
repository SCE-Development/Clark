const express = require('express');
const router = express.Router();

const {
  BAD_REQUEST,
  SERVER_ERROR,
  NOT_FOUND,
  OK,
} = require('../../util/constants').STATUS_CODES;

const User = require('../models/User');
const { getMemberExpirationDate } = require('../util/userHelpers');
const { findPayment, verifyPayment, rejectPayment } = require('../util/membershipPaymentQueries');
const { decodeToken } = require('../../util/auth');
const { writeLogToClient } = require('../../util/logging');

router.post('/verifyMembership', async (req, res) => {
    const decoded = await decodeToken(req, membershipState.PENDING);
    if (decoded.status !== OK) {
        return res.sendStatus(decoded.status);
    }

    const { confirmationCode } = req.body 
    const userId = decoded.token._id

    if (!confirmationCode) {
        writeLogToClient(req.method, {
            statusCode: BAD_REQUEST,
            message: 'please type in your confirmation code',
        });
        return res.sendStatus(BAD_REQUEST);
    }

    try {
        const paymentDocument = await findPayment(confirmationCode)

        if (!paymentDocument) {
            writeLogToClient(req.method, {
                statusCode: NOT_FOUND,
                message: 'payment not found',
            });
            return res.sendStatus(NOT_FOUND);
        }
        const paymentId = paymentDocument._id
        const amount = paymentDocument.amount
        let accessLevel
        let membershipValidUntil
        
        if (amount >= 30) {
            accessLevel = membershipState.MEMBER
            membershipValidUntil = getMemberExpirationDate(2)
        } else if (amount >= 20) {
            accessLevel = membershipState.MEMBER
            membershipValidUntil = getMemberExpirationDate(1)
        } else {
            await rejectPayment(paymentId)
            writeLogToClient(req.method, {
                statusCode: BAD_REQUEST,
                message: 'not enough money sent to become a member',
            });
            return res.sendStatus(BAD_REQUEST);
        }

        await verifyPayment(paymentId, userId)
        await User.updateOne(
            { _id: userId },
            {
                $set: {
                    accessLevel,
                    membershipValidUntil
                }
            }
        )

        writeLogToClient(req.method, {
            statusCode: OK,
            message: 'successfully verified user',
        });
        return res.sendStatus(OK);

    } catch (error){
        writeLogToClient(req.method, {
            statusCode: SERVER_ERROR,
            message: 'internal server error',
        });
        return res.sendStatus(SERVER_ERROR);
    }
})
