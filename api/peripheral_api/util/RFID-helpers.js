const bcrypt = require('bcryptjs');
const { RFID_BCRYPT_SALT } = require('../../config/config.json');
const RFID = require('../models/RFID');
const { OK, BAD_REQUEST, NOT_FOUND } =
  require('../../util/constants').STATUS_CODES;

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

async function validate(payload) {
  return new Promise(async (resolve, reject) => {
    const { message } = JSON.parse(payload.toString());
    const hash = await hashedByte(message);
    let cards = [];
    cards.push(... await getCards());
    let found = false;
    for (let card of cards) {
      if (card.byte === hash) {
        found = true;
        resolve(OK);
      }
    }
    if (!found) {
      resolve(NOT_FOUND);
    }
  });
}

async function createRfid(name, payload) {
  return new Promise(async (resolve, reject) => {
    const newRFID = new RFID({
      name: name,
      byte: await hashedByte(JSON.parse(payload.toString()).message)
    });
    RFID.create(newRFID, (error) => {
      if (error) {
        resolve(BAD_REQUEST);
      } else {
        resolve(OK);
      }
    });
  });
}

module.exports = { validate, createRfid };
