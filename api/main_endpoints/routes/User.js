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
const { decodeToken } = require('../util/token-functions');
const {
  OK,
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  CONFLICT,
  SERVER_ERROR,
} = require('../../util/constants').STATUS_CODES;
const membershipState = require('../../util/constants').MEMBERSHIP_STATE;
const AuditLog = require('../models/AuditLog.js');
const AuditLogActions = require('../util/auditLogActions.js');

const logger = require('../../util/logger');

const {sendUnsubscribeEmail} = require('../util/emailHelpers');
const crypto = require('crypto');

const ROWS_PER_PAGE = 20;

const SENSITIVE_FIELDS = [
  'email',
  'accessLevel',
  'pagesPrinted',
  'doorCode'
];

const ALLOWED_FIELDS = [
  'firstName', 'lastName', 'email', 'accessLevel', 'major',
  'discordID', 'emailOptIn', 'membershipValidUntil', 'pagesPrinted',
  'doorCode'
];

// Delete a member
router.post('/delete', async (req, res) => {
  const decoded = await decodeToken(req);
  if (decoded.status !== OK) {
    return res.sendStatus(decoded.status);
  }

  const targetUser = await User.findById(req.body._id);
  if (!targetUser) {
    return res.sendStatus(NOT_FOUND);
  }

  // If not officer, only allow deletion of own account
  if (decoded.token.accessLevel < membershipState.OFFICER) {
    if (req.body._id && req.body._id !== decoded.token._id) {
      return res
        .status(FORBIDDEN)
        .json({ message: 'you must be an officer or admin to delete other users' });
    }
  }

  // Check if req has lower privilege than the account they wish to delete
  if (targetUser.accessLevel !== 'undefined') {
    if (decoded.token.accessLevel < targetUser.accessLevel) {
      return res
        .status(FORBIDDEN)
        .json( { message: 'you must have higher privileges to delete users with lower privileges'});
    }
  }

  User.deleteOne({ _id: req.body._id }, function(error, user) {
    if (error) {
      logger.error('Unable to delete user with id', req.body._id, error);
      return res.sendStatus(BAD_REQUEST);
    }

    if (user.n < 1) {
      return res.sendStatus(NOT_FOUND);
    }
    return res.sendStatus(OK);
  });
});

// Search for a member
router.post('/search', async function(req, res) {
  const decoded = await decodeToken(req, membershipState.OFFICER);
  if (decoded.status !== OK) {
    return res.sendStatus(decoded.status);
  }

  User.findOne({ email: req.body.email }, function(error, result) {
    if (error) {
      return res.sendStatus(BAD_REQUEST);
    }

    if (!result) {
      return res
        .sendStatus(NOT_FOUND);
    }

    const user = {
      firstName: result.firstName,
      middleInitial: result.middleInitial,
      lastName: result.lastName,
      email: result.email,
      emailVerified: result.emailVerified,
      emailOptIn: result.emailOptIn,
      discordUsername: result.discordUsername,
      discordDiscrim: result.discordDiscrim,
      discordID: result.discordID,
      active: result.active,
      accessLevel: result.accessLevel,
      major: result.major,
      joinDate: result.joinDate,
      lastLogin: result.lastLogin,
      membershipValidUntil: result.membershipValidUntil,
      pagesPrinted: result.pagesPrinted,
      escrowPagesPrinted: result.escrowPagesPrinted,
      doorCode: result.doorCode,
      _id: result._id
    };
    return res.status(OK).send(user);
  });
});

// Search for all members
router.post('/users', async function(req, res) {
  const decoded = await decodeToken(req, membershipState.OFFICER);
  if (decoded.status !== OK) {
    return res.sendStatus(decoded.status);
  }

  let maybeOr = {};
  if (req.body.query) {
    maybeOr = {
      $or: ['firstName', 'lastName', 'email'].map((fieldName) => ({
        [fieldName]: {
          // req.body, req.query, req.body.query, oh man
          $regex: RegExp(req.body.query, 'i'),
        }
      }))
    };
  }

  const sortColumn = req.query.sort || 'joinDate';

  const orderToInteger = {
    desc: -1,
    asc: 1,
    default: -1
  };
  const sortOrder = orderToInteger[req.query.order] || orderToInteger.default;

  // make sure that the page we want to see is 0 by default
  // and avoid negative page numbers
  let skip = Math.max(Number(req.body.page) || 0, 0);
  skip *= ROWS_PER_PAGE;
  const total = await User.count(maybeOr);
  User.find(maybeOr, { password: 0, }, { skip, limit: ROWS_PER_PAGE, })
    .sort({ [sortColumn] : sortOrder })
    .then(items => {
      res.status(OK).send({ items, total, rowsPerPage: ROWS_PER_PAGE, });
    })
    .catch((e) => {
      res.sendStatus(BAD_REQUEST);
    });
});

// Edit/Update a member record
router.post('/edit', async (req, res) => {
  const decoded = await decodeToken(req);
  if (decoded.status !== OK) {
    return res.sendStatus(decoded.status);
  }

  const { accessLevel, _id: tokenId, email: tokenEmail } = decoded.token;
  const { _id: targetId, password, numberOfSemestersToSignUpFor, ...userData } = req.body;
  const isOfficer = accessLevel >= membershipState.OFFICER;
  const isTargetAdmin = accessLevel === membershipState.ADMIN;

  if (!targetId) {
    return res.sendStatus(BAD_REQUEST);
  }

  const existingUser = await User.findById(targetId);
  if (!existingUser) {
    return res.status(NOT_FOUND).send({ message: 'User not found.' });
  }

  if (!isOfficer && targetId.toString() !== tokenId.toString()) {
    return res
      .status(FORBIDDEN)
      .send('Unauthorized to edit another user');
  }

  // Members cannot change email, accessLevel, pagesPrinted, or doorCode
  const forbiddenField = SENSITIVE_FIELDS.find(field => field in userData);

  if (!isOfficer && forbiddenField) {
    return res
      .status(UNAUTHORIZED)
      .send(`Unauthorized to change sensitive field: ${forbiddenField}`);
  }

  // Officers cannot change accessLevel to ADMIN
  if (isOfficer && userData.accessLevel === membershipState.ADMIN && !isTargetAdmin) {
    return res.sendStatus(UNAUTHORIZED);
  }

  // Prepare Data for Update (Sanitization)
  const dataToUpdate = {};
  const fieldChanges = {};

  // Iterate through allowed fields and build the update object and audit log
  ALLOWED_FIELDS.forEach(field => {
    // Only include the field if it was provided in the request body
    if (userData[field] !== undefined) {
      // Check if value actually changed for audit
      if (userData[field] !== existingUser[field]) {
        fieldChanges[field] = { from: existingUser[field], to: userData[field] };
      }
      dataToUpdate[field] = userData[field];
    }
  });

  // Handle special membership duration field
  if (typeof numberOfSemestersToSignUpFor !== 'undefined' && isOfficer) {
    dataToUpdate.membershipValidUntil = getMemberExpirationDate(
      parseInt(numberOfSemestersToSignUpFor)
    );
    // Audit the implicit change
    if (existingUser.membershipValidUntil !== dataToUpdate.membershipValidUntil) {
      fieldChanges.membershipValidUntil = {
        from: existingUser.membershipValidUntil,
        to: dataToUpdate.membershipValidUntil
      };
    }
  }

  // Handle Password Hashing and Audit
  if (password) {
    const hashedPassword = await hashPassword(password);
    if (!hashedPassword) {
      return res.sendStatus(SERVER_ERROR);
    }
    dataToUpdate.password = hashedPassword;

    // Create audit log for password change
    AuditLog.create({
      userId: tokenId,
      action: AuditLogActions.CHANGE_PW,
      details: { email: existingUser.email, userId: tokenId },
    }).catch(logger.error);
  }

  // If no fields are actually changing (excluding the token, which was removed above)
  if (Object.keys(dataToUpdate).length === 0 && !password) {
    return res.status(OK).send({ message: 'No changes submitted.' });
  }

  try {
    const result = await User.updateOne({ _id: targetId }, dataToUpdate);

    // Check if the update actually modified a document
    if (result.nModified < 1 && result.matchedCount > 0) {
      // Matched but not modified means no fields actually changed.
      // We can safely treat this as a success if no error occurred.
    } else if (result.nModified < 1 && result.matchedCount < 1) {
      return res.status(NOT_FOUND).send({ message: `${existingUser.email} not found.` });
    }

    if (Object.keys(fieldChanges).length > 0) {
      // Create a simplified log of what was updated
      const auditDetails = {
        updatedInfo: JSON.stringify({ ...dataToUpdate, password: !!password }), // true/false for password
        fieldChanges: JSON.stringify(fieldChanges)
      };

      AuditLog.create({
        userId: tokenId,
        action: AuditLogActions.UPDATE_USER,
        documentId: targetId,
        details: auditDetails
      }).catch(logger.error);
    }

    return res.status(OK).send({
      message: `${existingUser.email} was updated.`,
      membershipValidUntil: dataToUpdate.membershipValidUntil || existingUser.membershipValidUntil
    });

  } catch (error) {
    logger.error('/edit had an error:', error);
    return res.status(BAD_REQUEST).send({ message: 'Bad Request: Unable to update user.' });
  }
});

router.post('/getPagesPrintedCount', async (req, res) => {
  const decoded = await decodeToken(req);
  if (decoded.status !== OK) {
    return res.sendStatus(decoded.status);
  }
  User.findOne({ email: req.body.email }, function(error, result) {
    if (error) {
      const info = {
        errorTime: new Date(),
        apiEndpoint: 'user/PagesPrintedCount',
        errorDescription: error
      };
      logger.error(info);

      return res.status(BAD_REQUEST).send({ message: 'Bad Request.' });
    }

    if (!result) {
      return res
        .status(NOT_FOUND)
        .send({ message: `${req.body.email} not found.` });
    }
    return res.status(OK).json(result.pagesPrinted + result.escrowPagesPrinted);
  });
});

router.post('/getUserById', async (req, res) => {
  const decoded = await decodeToken(req);
  if (decoded.status !== OK) {
    return res.sendStatus(decoded.status);
  }
  let targetUserId = req.body.userID;

  // If not officer, only allow reading of own account
  if (decoded.token.accessLevel < membershipState.OFFICER) {
    // 1. Force the lookup ID to be the logged-in user's ID
    targetUserId = decoded.token._id;

    // 2. If the user tried to request a *different* ID, explicitly block them
    if (req.body.userID && req.body.userID !== decoded.token._id) {
      return res
        .status(FORBIDDEN)
        .json({ message: 'you must be an officer or admin to read other users\' data' });
    }
  }

  // If no ID was provided in the request body, use the token ID as a fallback
  if (!targetUserId) {
    targetUserId = decoded.token._id;
  }

  User.findOne({ _id: req.body.userID}, (err, result) => {
    if (err) {
      return res.sendStatus(BAD_REQUEST);
    }

    if (!result) {
      return res.sendStatus(NOT_FOUND);
    }

    const { password, ...omittedPassword } = result._doc;

    return res.status(OK).json(omittedPassword);
  });
});

router.post('/setUserEmailPreference', (req, res) => {
  const email = req.body.email;
  const emailOptIn = !!req.body.emailOptIn;

  User.updateOne(
    { email: email },
    { emailOptIn: emailOptIn },
    function(error, result) {
      if (error) {
        res.status(BAD_REQUEST).send({ message: 'Bad Request.' });
      }

      if (result.n === 0) {
        return res
          .status(NOT_FOUND)
          .send({ message: `${email} not found.` });
      }
      return res.status(OK).send({
        message: `${email} was updated.`,
        emailOptIn: emailOptIn,
      });
    }
  );
});

router.post('/getUserDataByEmail', (req, res) => {
  User.findOne({ email: req.body.email }, function(error, result) {
    if (error) {
      res.status(BAD_REQUEST).send({ message: 'Bad Request.' });
    }

    if (!result) {
      return res
        .status(NOT_FOUND)
        .send({ message: `${req.body.email} not found.` });
    }
    const user = {
      firstName: result.firstName,
      lastName: result.lastName,
      emailOptIn: result.emailOptIn,
    };
    return res.status(OK).send(user);
  });
});

// Search for all members with verified emails and subscribed
router.post('/usersSubscribedAndVerified', async function(req, res) {
  const decoded = await decodeToken(req, membershipState.OFFICER);
  if (decoded.status !== OK) {
    return res.sendStatus(decoded.status);
  }
  User.find({ emailVerified: true, emailOptIn: true })
    .then((users) => {
      if (users.length) {
        const userEmailAndName = users.map((user) => {
          return {
            email : user.email,
            firstName : user.firstName,
            lastName : user.lastName
          };
        });
        sendUnsubscribeEmail(userEmailAndName);
      }
      return res.sendStatus(OK);
    })
    .catch((err) => {
      res.status(BAD_REQUEST).send({ message: 'Bad Request.' });
    });
});

// Search for all members with verified emails, subscribed, and not banned or pending
router.post('/usersValidVerifiedAndSubscribed', async function(req, res) {
  const decoded = await decodeToken(req, membershipState.OFFICER);
  if (decoded.status !== OK) {
    return res.sendStatus(decoded.status);
  }
  User.find({
    emailVerified: true,
    emailOptIn: true,
    accessLevel: { $gte: membershipState.NON_MEMBER }
  })
    .then((users) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/csv');
      res.write('email\r\n');
      users.forEach(function(user) {
        res.write(user.email + '\r\n');
      });
      return res.end();
    })
    .catch((err) => {
      logger.error('/usersValidVerifiedAndSubscribed/ had an error:', err);
      res.sendStatus(BAD_REQUEST);
    });
});

// Generate an API key for the Messages API if the user does not have an API key; otherwise, return the existing API key
router.post('/apikey', async (req, res) => {
  const decoded = await decodeToken(req);
  if (decoded.status !== OK) {
    return res.sendStatus(decoded.status);
  }
  let { _id } = decoded.token;

  User.findOne({_id})
    .then((user) => {
      if (!user) {
        return res.sendStatus(NOT_FOUND);
      }
      // logic to generate api key or return existing api key
      if (user.apiKey) {
        return res.status(OK).send({apiKey: user.apiKey});
      }
      let apiKey = crypto.randomUUID();
      User.updateOne({_id}, {apiKey})
        .then((result) => {
          if (result.n == 0) {
            return res.sendStatus(UNAUTHORIZED);
          }
          return res.status(OK).send({apiKey});
        });
    })
    .catch(() => {
      return res.sendStatus(BAD_REQUEST);
    });
});

//  Finds total number of new signups this semester
//  Finds number of those signups who've paid for semester plan
//  Finds number of those signups who've paid for annual plan
//  Assumes members who have paid have been assigned an expiration date
router.get('/getNewPaidMembersThisSemester', async (req, res) => {
  const decoded = await decodeToken(req, membershipState.OFFICER);
  if (decoded.status !== OK) {
    return res.sendStatus(decoded.status);
  }

  const today = new Date();
  //  First semester start date - Jan 1st
  let semesterStart = new Date(today.getFullYear(), 0, 1);
  if(today.getMonth() >= 5) {
    //  Second semester start date - June 1st
    semesterStart = new Date(today.getFullYear(), 5, 1);
  }

  const getNewSingleSemesterMembersCount = User.countDocuments({'emailVerified':true, 'accessLevel': membershipState.MEMBER,
    'membershipValidUntil': getMemberExpirationDate(1),
    'joinDate': {
      $gte: semesterStart
    },
  });
  const getNewAnnualMembersCount = User.countDocuments({'emailVerified':true, 'accessLevel': membershipState.MEMBER,
    'membershipValidUntil': getMemberExpirationDate(2),
    'joinDate': {
      $gte: semesterStart
    },
  });
  const getNewMembersThisYearCount = User.countDocuments({'emailVerified': true, 'accessLevel': membershipState.MEMBER, 'joinDate': {
    //  Jan 1st Start of Year
    $gte: new Date(today.getFullYear(), 0, 1)
  }});
  const getCurrentActiveMembersCount = User.countDocuments({'emailVerified': true, 'accessLevel': membershipState.MEMBER, 'membershipValidUntil': {
    //  Today
    $gt: new Date()
  }});

  const [
    newSingleSemesterMembers,
    newAnnualMembers,
    newMembersThisYear,
    currentActiveMembers,
  ] = await Promise.all([
    getNewSingleSemesterMembersCount,
    getNewAnnualMembersCount,
    getNewMembersThisYearCount,
    getCurrentActiveMembersCount
  ]);

  try {
    const response = {
      newSingleSemesterMembers,
      newAnnualMembers,
      newMembersThisYear,
      currentActiveMembers,
    };
    return res.status(OK).send(response);
  } catch {
    return res.sendStatus(BAD_REQUEST);
  }
});

module.exports = router;
