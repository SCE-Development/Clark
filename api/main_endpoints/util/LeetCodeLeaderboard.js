const logger = require('../../util/logger');
const {
  OK,
  SERVER_ERROR,
} = require('../../util/constants').STATUS_CODES;
const SIGN2_URL = process.env.SIGN2_URL || 'http://localhost:12121';

async function getAllUsers() {
  try {
    const url = new URL('/getAllUsers', SIGN2_URL);
    const res = await fetch(url.href);
    const data = await res.json();
    if ('error' in data) {
      logger.error('Error from LeetCode Leaderboard: ', data.error);
      return null;
    }
    return data.users;
  } catch (err) {
    logger.error('getAllUsers encountered an error: ', err);
    return null;
  }
}

async function addUserToLeaderboard(userData) {
  try {
    const url = new URL('/user/add', SIGN2_URL);
    const res = await fetch(url.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if ('error' in data) {
      logger.error('Error from LeetCode Leaderboard: ', data.error);
      return data.status_code;
    }
    return OK;
  } catch (err) {
    logger.error('addUserToLeaderboard encountered an error: ', err);
    return SERVER_ERROR;
  }
}

async function deleteUserFromLeaderboard(username) {
  try {
    const url = new URL('/user/remove', SIGN2_URL);
    const res = await fetch(url.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });
    const data = await res.json();
    if ('error' in data) {
      logger.error('Error from LeetCode Leaderboard: ', data.error);
      return false;
    }
    return true;
  } catch (err) {
    logger.error('deleteUserFromLeaderboard encountered an error: ', err);
    return false;
  }
}

module.exports = {
  getAllUsers,
  addUserToLeaderboard,
  deleteUserFromLeaderboard,
};
