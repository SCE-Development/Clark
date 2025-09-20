const {
  UNAUTHORIZED,
  BAD_REQUEST,
  SERVER_ERROR,
  NOT_FOUND,
  OK,
  FORBIDDEN,
} = require('../../util/constants').STATUS_CODES;
const membershipState = require('../../util/constants').MEMBERSHIP_STATE;
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const OfficeAccessCard = require('../models/OfficeAccessCard.js');
const logger = require('../../util/logger');
const { officeAccessCard = {} } = require('../../config/config.json');
const { API_KEY = 'NOTHING_REALLY' } = officeAccessCard;
const { decodeToken } = require('../util/token-functions.js');
const ROWS_PER_PAGE = 25;
const {
  checkIfCardExists,
  generateAlias,
  deleteCard,
  editAlias,
} = require('../util/OfficeAccessCard.js');
const AuditLogActions = require('../util/auditLogActions.js');
const AuditLog = require('../models/AuditLog.js');

router.use(bodyParser.json());

let clients = [];

const defaultGetResponse = {
  message: 'Card authorized!',
  endpoint: '/verify',
  requestType: 'GET',
  alias: 'N/A',
};

const defaultPostResponse = {
  message: 'Card deleted!',
  endpoint: '/delete',
  requestType: 'POST',
  alias: 'N/A',
};

const writeLogToClient = (requestType, { statusCode, ...rest }) => {
  let response = {};
  if (requestType === 'GET') {
    response = {
      statusCode,
      ...defaultGetResponse,
      ...rest,
    };
  } else {
    response = {
      statusCode,
      ...defaultPostResponse,
      ...rest,
    };
  }
  clients.forEach(client => {
    client.res.write(`data: ${JSON.stringify(response)}\n\n`);
  });
};

router.get('/verify', async (req, res) => {
  const { cardBytes, add = false } = req.query;
  const apiKey = req.headers['x-api-key'];
  const required = [
    { value: apiKey, title: 'X-API-Key HTTP header', },
    { value: cardBytes, title: 'cardBytes query parameter', },
  ];

  const missingValue = required.find(({ value }) => !value);

  if (missingValue) {
    writeLogToClient(req.method, {
      statusCode: BAD_REQUEST,
      message: `${missingValue.title} missing from request`
    });
    return res.status(BAD_REQUEST).send(`${missingValue.title} missing from request`);
  }

  if (apiKey !== API_KEY) {
    writeLogToClient(req.method, {
      statusCode: UNAUTHORIZED,
      message: `Invalid API key: ${apiKey}`,
    });
    return res.sendStatus(UNAUTHORIZED);
  }

  const cardExists = await checkIfCardExists({ cardBytes });
  if (cardExists) {
    const alias = cardExists.alias;
    AuditLog.create({
      action: AuditLogActions.VERIFY_CARD,
      details: { alias }
    });
    writeLogToClient(req.method, { alias: cardExists.alias, statusCode: OK });
    return res.sendStatus(OK);
  }
  // if a card doesnt exist and we arent trying
  // to add a new one, that means we were trying
  // to verify a card, and that card isnt found.
  // therefore return a non OK status
  if (!add) {
    writeLogToClient(req.method, { statusCode: NOT_FOUND, message: 'Card not found' });
    return res.sendStatus(NOT_FOUND);
  }
  // if we reached here, the card does not exist and is trying to be added
  const alias = await generateAlias();
  try {
    logger.info('adding a new card');
    const newCard = await new OfficeAccessCard({ cardBytes, alias, }).save();
    if (newCard) {
      AuditLog.create({
        action: AuditLogActions.ADD_CARD,
        details: { alias }
      });
    }
    writeLogToClient(req.method, {
      alias,
      statusCode: OK,
      message: 'Card added!',
      endpoint: '/verify?add=1'
    });
    return res.sendStatus(OK);
  } catch (error) {
    logger.error('Error creating OfficeAccessCard: ', error);
    writeLogToClient(req.method, {
      alias,
      statusCode: SERVER_ERROR,
      endpoint: '/verify?add=1',
      message: `Error creating Office AccessCard: ${error}`
    });
    return res.sendStatus(SERVER_ERROR);
  }
});

router.post('/delete', async (req, res) => {
  const decoded = await decodeToken(req, membershipState.OFFICER);
  if (decoded.status !== OK) {
    return res.sendStatus(decoded.status);
  }

  const { alias } = req.body;
  if (!alias) {
    writeLogToClient(req.method, {
      statusCode: BAD_REQUEST,
      message: 'cardBytes missing from request',
    });
    return res.sendStatus(BAD_REQUEST);
  }

  const cardExists = await checkIfCardExists({ alias });
  if (!await cardExists) {
    logger.info('Card does not exist');
    writeLogToClient(req.method, {
      statusCode: NOT_FOUND,
      message: 'Card does not exist',
    });
    return res.sendStatus(NOT_FOUND);
  }

  if (await deleteCard(alias)) {
    logger.info('Successfully deleted card');
    writeLogToClient(req.method, {
      alias,
      statusCode: OK,
    });
    AuditLog.create({
      userId: decoded.token._id,
      action: AuditLogActions.DELETE_CARD,
      details: { alias }
    });
    return res.sendStatus(OK);
  }

  writeLogToClient(req.method, {
    alias: cardExists.alias,
    statusCode: SERVER_ERROR,
    message: 'Error deleting card',
  });
  return res.sendStatus(SERVER_ERROR);
});

router.post('/getAllCards', async (req, res) => {
  const decoded = await decodeToken(req, membershipState.OFFICER);
  if (decoded.status !== OK) {
    return res.sendStatus(decoded.status);
  }

  const skip = Math.max(Number(req.body.page) || 0, 0) * ROWS_PER_PAGE;

  try {
    const total = await OfficeAccessCard.count({});
    const items = await OfficeAccessCard.find(
      {},
      { cardBytes: 0 },
      { skip, limit: ROWS_PER_PAGE }
    );
    return res.status(OK).send({
      items,
      total,
      rowsPerPage: ROWS_PER_PAGE,
    });
  } catch (error) {
    logger.error('Error fetching cards: ', error);
    return res.sendStatus(SERVER_ERROR);
  }
});

router.post('/edit', async (req, res) => {
  const decoded = decodeToken(req);
  if (!decoded) {
    return res.sendStatus(UNAUTHORIZED);
  }

  const { _id, alias } = req.body;
  
  if (!_id || !alias) {
    return res.status(BAD_REQUEST).send('_id and alias are required in request body');
  }

  // Validate alias is not empty or whitespace only
  if (!alias.trim()) {
    return res.status(BAD_REQUEST).send('alias cannot be empty or whitespace only');
  }

  // Validate _id is a valid ObjectId format
  if (!/^[0-9a-fA-F]{24}$/.test(_id)) {
    return res.status(BAD_REQUEST).send('_id must be a valid ObjectId');
  }

  try {
    const updatedCard = await editAlias(_id, alias);
    
    if (!updatedCard) {
      return res.status(NOT_FOUND).send('Card not found');
    }

    // Log the edit action
    AuditLog.create({
      userId: decoded._id,
      action: AuditLogActions.EDIT_CARD,
      details: { 
        cardId: _id,
        newAlias: alias,
        oldAlias: updatedCard.alias !== alias ? 'unknown' : alias
      }
    });

    logger.info(`Card alias updated successfully for card ID: ${_id}`);
    return res.status(OK).json({
      message: 'Card alias updated successfully',
      card: updatedCard
    });
    
  } catch (error) {
    logger.error('Error updating card alias: ', error);
    return res.status(SERVER_ERROR).send('Error updating card alias');
  }
});

router.get('/listen', async (req, res) => {
  const decoded = await decodeToken(req, membershipState.OFFICER);
  if (decoded.status !== OK) {
    return res.sendStatus(decoded.status);
  }

  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
    'X-Accel-Buffering': 'no'
  };

  res.writeHead(OK, headers);

  const newClient = { res };
  clients.push(newClient);

  req.on('close', () => {
    clients = clients.filter(c => c !== newClient);
    res.end();
  });
});

module.exports = router;
