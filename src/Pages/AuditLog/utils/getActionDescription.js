const simpleActionDescriptions = {
  SIGN_UP: 'signed up for an account',
  LOG_IN: 'logged into the system',
  PRINT_PAGE: 'printed a page',
  ACCESS_DOOR: 'accessed a door',
  CREATE_MESSAGE: 'created a message',
  DELETE_MESSAGE: 'deleted a message',
};

export const getActionDescription = log => {
  const action = log.action;

  // checks if a user updates or deletes ANOTHER user
  if (action === 'UPDATE_USER') {
    if (log.documentId && log.documentId !== log.userId) {
      return 'updated another user\'s account information';
    }
    return 'updated their account information';
  }

  if (action === 'DELETE_USER') {
    if (log.documentId && log.documentId !== log.userId) {
      return 'deleted another user account';
    }
    return 'deleted their account';
  }

  if (simpleActionDescriptions[action]) {
    return simpleActionDescriptions[action];
  }

  return `performed action: ${action.toLowerCase().replace(/_/g, ' ')}`;
};
