const logger = require('../../util/logger');
const LEETCODE_URL = 'http://192.168.69.180:8080';

async function getAllUsers() {
  try {
    const url = new URL('/getAllUsers', LEETCODE_URL);
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
    const url = new URL('/user/add', LEETCODE_URL);
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
      return false;
    }
    return true;
  } catch (err) {
    logger.error('addUserToLeaderboard encountered an error: ', err);
    return false;
  }
}

async function deleteUserFromLeaderboard(username) {
  try {
    const url = new URL('/user/remove', LEETCODE_URL);
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

async function checkIfUserExists(username) {
  try {
    const url = new URL('/checkIfUserExists', LEETCODE_URL);
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
      return {
        error: true,
        message: data.error,
        status: data.status_code,
      };
    }
    return {
      error: false,
      exists: data.exists,
    };
    
  } catch (err) {
    logger.error('checkIfUserExists encountered an error: ', err);
    return {
      error: true,
      message: err,
    };
  }
}

module.exports = {
  getAllUsers,
  addUserToLeaderboard,
  deleteUserFromLeaderboard,
  checkIfUserExists,
};

