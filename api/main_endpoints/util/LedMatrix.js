const logger = require('../../util/logger');
const LED_MATRIX_URL = 'fake url'; // replace later obv
const { MetricsHandler } = require('../../util/metrics');

async function healthCheck() {
  try {
    const url = new URL('/health-check', LED_MATRIX_URL);
    const res = await fetch(url.href);
    if (res.ok) {
      const data = await res.json();
      return data.status;
    }
    logger.error('Bad response from LED Matrix: error code ', res.status); // fix this later
    return false;
  } catch (err) {
    logger.error('healthCheck encountered an error: ', err);
    MetricsHandler.sshTunnelErrors.inc({ type: 'LED Matrix' });
    return false;
  }
}

async function getAllUsers() {
  try {
    const url = new URL('/getAllUsers', LED_MATRIX_URL);
    const res = await fetch(url.href);
    if (res.ok) {
      const data = await res.json();
      return data;
    }
    logger.error('Bad response from LED Matrix: error code ', res.status); // fix later
    return null;
  } catch (err) {
    logger.error('getAllUsers encountered an error: ', err);
    return null;
  }
}

async function addUserToLeaderboard(userData) {
  try {
    const url = new URL('/register', LED_MATRIX_URL);
    const res = await fetch(url.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // api key?
      },
      body: JSON.stringify(userData),
    });
    if (res.ok) {
      return true;
    }
    logger.error('Bad response from LED Matrix: error code ', res.status); // fix later
    return false;
  } catch (err) {
    logger.error('addUserToLeaderboard encountered an error: ', err);
    return false;
  }
}

async function deleteUserFromLeaderboard(username) {
  try {
    const url = new URL('/deleteUser', LED_MATRIX_URL);
    const res = await fetch(url.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // api key?
      },
      body: JSON.stringify({ username }),
    });
    if (res.ok) {
      return true;
    }
    logger.error('Bad response from LED Matrix: error code ', res.status); // fix later
    return false;
  } catch (err) {
    logger.error('deleteUserFromLeaderboard encountered an error: ', err);
    return false;
  }
}

async function updateLeaderboardUser(oldUserData, newUserData) {
  try {
    const url = new URL('/updateUser', LED_MATRIX_URL);
    const res = await fetch(url.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // api key?
      },
      body: JSON.stringify({ oldUserData, newUserData }),
    });
    if (res.ok) {
      return true;
    }
    logger.error('Bad response from LED Matrix: error code ', res.status); // fix later
    return false;
  } catch (err) {
    logger.error('updateLeaderboardUser encountered an error: ', err);
    return false;
  }
}

function addAnnouncement(announcement) {

}

function deleteAnnouncement(announcement) {

}

module.exports = {
  healthCheck,
  getAllUsers,
  addUserToLeaderboard,
  deleteUserFromLeaderboard,
  updateLeaderboardUser,
  addAnnouncement,
  deleteAnnouncement,
};
