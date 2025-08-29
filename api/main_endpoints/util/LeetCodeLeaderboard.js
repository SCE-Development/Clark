const logger = require('../../util/logger');
const LEETCODE_URL = 'http://192.168.69.123:8001'; // replace later obv
const { MetricsHandler } = require('../../util/metrics');

// NEED TO MODIFY THESE TO RETURN ERROR CODES AND MESSAGES FROM FASTAPI

async function healthCheck() {
  try {
    const url = new URL('/health-check', LEETCODE_URL);
    const res = await fetch(url.href);
    if (res.ok) {
      const data = await res.json();
      return data.status;
    }
    logger.error('Bad response from LeetCode Leaderboard: error code ', res.status); // fix this later
    return false;
  } catch (err) {
    logger.error('healthCheck encountered an error: ', err);
    MetricsHandler.sshTunnelErrors.inc({ type: 'LeetCode Leaderboard' });
    return false;
  }
}

async function getAllUsers() {
  try {
    const url = new URL('/getAllUsers', LEETCODE_URL);
    const res = await fetch(url.href);
    if (res.ok) {
      const data = await res.json();
      return data.users;
    }
    logger.error('Bad response from LeetCode Leaderboard: error code ', res.status); // fix later
    return null;
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
    if (res.ok) {
      return true; 
    }
    logger.error('Bad response from LeetCode Leaderboard: error code ', res.status); // fix later
    return false;
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
    if (res.ok) {
      return true;
    }
    logger.error('Bad response from LeetCode Leaderboard: error code ', res.status); // fix later
    return false;
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
    if (res.ok) {
      const data = await res.json();
      return {
        error: false,
        exists: data.exists,
      }
    }
    logger.error('Bad response from LeetCode Leaderboard: ', res.message); // fix later
    return {
      error: true,
      message: res.message,
      status: res.status,
    };
  } catch (err) {
    logger.error('checkIfUserExists encountered an error: ', err);
    return {
      error: true,
      message: err,
    }
  }
}

module.exports = {
  healthCheck,
  getAllUsers,
  addUserToLeaderboard,
  deleteUserFromLeaderboard,
  checkIfUserExists,
};
