const bcrypt = require('bcryptjs');
const { RFID_BCRYPT_SALT } = require('../../config/config.json');
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

module.exports = { hashedByte };
