const bcrypt = require('bcryptjs');
const { secretKey } = require('../../config/config.json');
const RFID = require('../models/RFID');
const { OK, BAD_REQUEST, NOT_FOUND } =
  require('../../util/constants').STATUS_CODES;
const fs = require('fs');
const logger = require('../../util/logger');

/**
 * Abstracts RFID card backend logic to a class to improve readability.
 * @member {bool} addRfid - Keeps track of the state of the server, whether
 * card data from the ESP32 should be verified or added to the database.
 * @member {string|null} name - The name of the user we should add to
 * MongoDB along with card data. When the server is in the add RFID state,
 * this variable is populated with said name.
 */
class RfidHelper {
  constructor() {
    this.addRfid = false;
    this.name = null;
    this.inTesting = false;
  }

  /**
   * Helper function to determine the state of the RFID API.
   * @returns {bool} If we are adding a card the value is true,
   * else false for verifying.
   */
  addingRfid() {
    logger.info('Adding RFID');
    return this.addRfid;
  }

  /**
   * Determines if the required files are present for the RFID server to work.
   * We check if an array of file names are present in api/config/AWS-IOT/
   * directory. A boolean value is returned depending on their presence.
   * @returns {bool} If the files are present the value is true,
   * else false.
   */
  keysExist() {
    const filePaths = ['private.pem.key', 'cert.pem.crt', 'AmazonRootCA1.pem'];
    for (const filePath of filePaths) {
      try {
        if (!fs.existsSync('../api/config/AWS-IOT/' + filePath)) {
          logger.info('Missing AWS-IOT key file');
          return false;
        }
      } catch (e) {
        logger.info('Something went wrong with AWS-IOT key file: ', e);
        return false;
      }
    }
    return true;
  }

  /**
   * Helper function to determine if currently running in testing
   * @return If running api tests then it return true else returns false
   */
  testing() {
    logger.info('Testing');
    return this.inTesting;
  }

  /**
   * Helper function to hash the RFID data for security purposes
   * @param {String|null} byte RFID card data
   * @returns a hashed value if successful else null
   */
  hashCardData(byte) {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, function(error, salt) {
        if (error) {
          logger.info('Something went wrong with hashing card data: ', error);
          resolve(null);
        }
        bcrypt.hash(byte, secretKey, function(hashError, hash) {
          if (hashError) {
            logger.info(
              'Something went wrong with hashing card data: ',
              hashError
            );
            resolve(null);
          }
          logger.info('Card data hashed successfully');
          resolve(hash);
        });
      });
    });
  }

  /**
   * Retrieves all RFID cards in the database
   * @returns {Promise<Array<Object>>}
   */
  getCards() {
    return new Promise((resolve, reject) => {
      logger.info('Getting cards');
      RFID.find()
        .then((items) => resolve(items))
        .catch((error) => {
          logger.info('Something went wrong with getting cards: ', error);
          resolve([]);
        });
    });
  }

  /**
   * Validates the scanned RFID card by comparing the hashed data
   * with the one in the database
   * @param {JSONObject} payload Incoming card data from ESP32
   * @returns {Number} 404 if card data was null or not in the database
   * else 200 if the incoming data is not null and it exists in the database
   */
  async validateCard(payload) {
    return new Promise(async (resolve, reject) => {
      const { message } = JSON.parse(payload.toString());
      const hash = await this.hashCardData(message);
      if (hash === null) {
        resolve(NOT_FOUND);
      } else {
        let cards = [];
        cards.push(... await this.getCards());
        let found = false;
        for (let card of cards) {
          if (card.byte === hash) {
            found = true;
            logger.info('Card found');
            resolve(OK);
          }
        }
        if (!found) {
          logger.info('Card not found');
          resolve(NOT_FOUND);
        }
      }

    });
  }

  /**
   * Creates and adds a new RFID card in the database
   * @param {String|null} name Name of the cardholder
   * @param {JSONObject} payload Incoming card data from ESP32
   * @returns {Number} 400 if incoming data was null or if the card already
   * exists in the database else returns 200 if successful
   */
  async createRfid(name, payload) {
    return new Promise(async (resolve, reject) => {
      const newRFID = new RFID({
        name: name,
        byte: await this.hashCardData(JSON.parse(payload.toString()).message)
      });
      if (newRFID.name === null || newRFID.byte === null) {
        logger.info('RFID name or byte is null');
        resolve(BAD_REQUEST);
      } else {
        RFID.create(newRFID, (error) => {
          if (error) {
            logger.info('Something went wrong with creating RFID: ', error);
            resolve(BAD_REQUEST);
          } else {
            logger.info('RFID created successfully');
            resolve(OK);
          }
        });
      }
    });
  }

  /**
   * Handles incoming messages from ESP32
   * If in creating mode, then it will create new RFID card
   * else validate RFID card
   * @param {Wrapper} device  MQTT Client Wrapper
   * @param {JSONObject} payload Incoming card data from ESP32
   */
  async handleAwsIotMessage(device, payload) {
    if (this.addRfid) {
      const creatorResponse = await this.createRfid(this.name, payload);
      logger.info('Sending creation message to ESP32');
      device.publish('MessageForESP32', JSON.stringify({
        message: creatorResponse
      }));
      this.name = null;
      this.addRfid = false;
      clearTimeout();
    } else {
      const validateResponse = await this.validateCard(payload);
      logger.info('Sending validation message to ESP32');
      device.publish('MessageForESP32', JSON.stringify({
        message: validateResponse
      }));
    }
  }
  /**
   * Starts a timeout counter during creating mode
   * in case the card is never scanned, it will return to the
   * original state which is validating
   * @param {String|null} name The name of the cardholder
   */
  startCountdownToAddCard(name) {
    this.addRfid = true;
    this.name = name;
    setTimeout(() => {
      this.addRfid = false;
      this.name = null;
    }, 60000);
  }
}


module.exports = { RfidHelper };
