const bcrypt = require('bcryptjs');
const { RFID_BCRYPT_SALT } = require('../../config/config.json');
const RFID = require('../models/RFID');
const { OK, BAD_REQUEST, NOT_FOUND } =
  require('../../util/constants').STATUS_CODES;
const fs = require('fs');


class RfidHelper {
  constructor() {
    this.addRfid = false;
    this.name = null;
  }

  addingRfid () {
    return this.addRfid;
  }

  keysExist() {
    const filePaths = ['private.pem.key', 'cert.pem.crt', 'AmazonRootCA1.pem'];
    for (const filePath of filePaths) {
      try {
        if (!fs.existsSync('../api/config/AWS-IOT/' + filePath)) {
          return false;
        }
      } catch (e) {
        return false;
      }
    }
    return true;
  }
  
  hashedByte(byte) {
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

  getCards() {
    return new Promise((resolve, reject) => {
      RFID.find()
        .then((items) => resolve(items))
        .catch((error) => {
          resolve([]);
        });
    });
  }

  async validate(payload) {
    return new Promise(async (resolve, reject) => {
      const { message } = JSON.parse(payload.toString());
      const hash = await this.hashedByte(message);
      let cards = [];
      cards.push(... await this.getCards());
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

  async createRfid(name, payload) {
    return new Promise(async (resolve, reject) => {
      const newRFID = new RFID({
        name: name,
        byte: await this.hashedByte(JSON.parse(payload.toString()).message)
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

  async handleAwsIotMessage(device, payload) {
    if (this.addRfid) {
      const creatorResponse = await this.createRfid(this.name, payload);
      device.publish('MessageForESP32', JSON.stringify({
        message: creatorResponse
      }));
      this.name = null;
      this.addRfid = false;
      clearTimeout();
    } else {
      const validateResponse = await this.validate(payload);
      device.publish('MessageForESP32', JSON.stringify({
        message: validateResponse
      }));
    }
  }

  startCountdownToAddCard(name) {
    this.addRfid = true;
    this.name = name
    setTimeout(() => {
      this.addRfid = false;
      this.name = null;
    }, 60000);
  }
}


module.exports = { RfidHelper };
