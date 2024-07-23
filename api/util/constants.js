const STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
};

const MEMBERSHIP_STATE = {
  BANNED: -2,
  PENDING: -1,
  NON_MEMBER: 0,
  ALUMNI: 0.5,
  MEMBER: 1,
  OFFICER: 2,
  ADMIN: 3,
};

const MESSAGES_API = {
  MAX_AMOUNT_OF_CONNECTIONS: 3
};

const consoleColors = {
  redColor: '\x1b[31m',
  greenColor: '\x1b[32m',
  blueColor: '\x1b[34m',
  yellowColor: '\x1b[33m',
  defaultColor: '\x1b[0m',
};

module.exports = {
  STATUS_CODES,
  MEMBERSHIP_STATE,
  MESSAGES_API,
  consoleColors,
};
