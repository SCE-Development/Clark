export const STATUS_CODES = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    SERVER_ERROR: 500,
};
  
export const MEMBERSHIP_STATE = {
    BANNED: -2,
    PENDING: -1,
    NON_MEMBER: 0,
    ALUMNI: 0.5,
    MEMBER: 1,
    OFFICER: 2,
    ADMIN: 3,
};
  
export const DEFAULT_PHOTO_URL =
    'https://i.gyazo.com/640f22609f95f72a28afa0a130e557a1.png';
  
export const TEAM_TYPE = {
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
  
export const CONSOLE_COLOR = {
    RED: '\x1b[31m',
    GREEN: '\x1b[32m',
    BLUE: '\x1b[34m',
    YELLOW: '\x1b[33m',
    DEFAULT: '\x1b[0m',
};

export const IN_DEVELOPMENT_MODE = true;