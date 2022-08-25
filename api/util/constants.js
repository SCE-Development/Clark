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

const DEFAULT_PHOTO_URL =
  'https://i.gyazo.com/640f22609f95f72a28afa0a130e557a1.png';

const teamType = {
  DEVELOPMENT: 'Development',
  PUBLIC_RELATIONS: 'Public Relations',
  EVENT_PLANNING: 'Event Planning',
  PRINTING_3D: '3D Printing',
  ASSOCIATE: 'Associate',
  PRESIDENT: 'President',
  VICE_PRESIDENT: 'Vice President',
  DEV_CHAIR: 'Software Development Chair',
  EVENT_CHAIR: 'Event Planning Chair',
  TREASURER: 'Treasurer',
  STORE_MANAGER: 'Store Manager',
  PRINTING_3D_CHAIR: '3D Printing/Hacking Station Specialist'
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
  DEFAULT_PHOTO_URL,
  MEMBERSHIP_STATE,
  teamType,
  consoleColors,
};
