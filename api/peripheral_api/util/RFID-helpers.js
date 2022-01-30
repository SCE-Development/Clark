const bcrypt = require('bcryptjs');
const { RFID_BCRYPT_SALT } = require('../../config/config.json');
const RFID = require('../models/RFID');
const { device } = require('../routes/RFID');
const { OK, BAD_REQUEST, NOT_FOUND } =
  require('../../util/constants').STATUS_CODES;

function hashedByte(byte) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, function (error, salt) {
      if (error) {
        resolve(null);
      }
      bcrypt.hash(byte, RFID_BCRYPT_SALT, function (hashError, hash) {
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

async function onMessage(addRfid, newName, payload) {
  if (addRfid) {
    const newRFID = new RFID({
      name: newName,
      byte: await hashedByte(JSON.parse(payload.toString()).message)
    });
    RFID.create(newRFID, (error) => {
      if (error) {
        device.publish('MessageForESP32',
          JSON.stringify({
            message: BAD_REQUEST
          }));
      } else {
        device.publish('MessageForESP32',
          JSON.stringify({
            message: OK
          }));
      }
      newName = null;
      addRfid = false;
      clearTimeout();
    });
  } else {
    const { message } = JSON.parse(payload.toString());
    const hash = await hashedByte(message);
    let cards = [];
    cards.push(... await getCards());
    let found = false;
    for (let card of cards) {
      if (card.byte === hash) {
        found = true;
        device.publish('MessageForESP32',
          JSON.stringify({
            message: OK
          }));
      }
    }
    if (!found) {
      device.publish('MessageForESP32',
        JSON.stringify({
          message: NOT_FOUND
        }));
    }
  }
}

module.exports = { hashedByte, onMessage };
