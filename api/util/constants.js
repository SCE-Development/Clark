const STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409
};

const MEMBERSHIP_STATE = {
  BANNED: -2,
  PENDING: -1,
  NON_MEMBER: 0,
  MEMBER: 1,
  OFFICER: 2,
  ADMIN: 3
};

const DEFAULT_PHOTO_URL =
  'https://sce.engr.sjsu.edu/wp-content/uploads/2016/04/SCE_sq.png';

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

module.exports = {
  STATUS_CODES,
  DEFAULT_PHOTO_URL,
  MEMBERSHIP_STATE,
  teamType
};
