const bcrypt = require('bcryptjs');
const { RFID_BCRYPT_SALT } = require('../../config/config.json');
const RFID = require('../models/RFID');
function hashedByte(byte) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, function(error, salt) {
      if (error) {
        resolve(null);
      }
      bcrypt.hash(byte, RFID_BCRYPT_SALT, function(hashError, hash) {
        if (hashError) {
          resolve(null);
        }
        resolve(hash);
      });
    });
  });
}

function getCards() {
  return new Promise((resolve, reject) => {
    RFID.find()
      .then((items) => resolve(items))
      .catch((error) => {
        resolve([]);
      });
  });
}

module.exports = { hashedByte, getCards };
