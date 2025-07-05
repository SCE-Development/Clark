export const getActionDescription = (log) => {
  const action = log.action;
  switch (action) {
  case 'SIGN_UP':
    return 'signed up for an account';
  case 'LOG_IN':
    return 'logged into the system';
  case 'UPDATE_USER':
    if (log.documentId && log.documentId !== log.userId) {
      return 'updated another user\'s account information';
    }
    return 'updated their account information';
  case 'DELETE_USER':
    if (log.documentId && log.documentId !== log.userId) {
      return 'deleted another user account';
    }
    return 'deleted their account';
  case 'PRINT_PAGE':
    return 'printed a page';
  case 'ACCESS_DOOR':
    return 'accessed a door';
  case 'CREATE_MESSAGE':
    return 'created a message';
  case 'DELETE_MESSAGE':
    return 'deleted a message';
  default:
    return `performed action: ${action.toLowerCase().replace(/_/g, ' ')}`;
  }
};
