const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const { consoleColors } = require('../../util/constants');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const logger = require('../../util/logger');

const {
  redColor,
  greenColor,
  defaultColor,
} = consoleColors;

/**
 * Handles our website's backend to interace with various Google APIs. It also
 * is able to generate a token file for us to invoke the API calls.
 */
class SceGoogleApiHandler {
  /**
   * Create a SceGoogleApiHandler object.
   * @param {Array<String>} scopes Contains all of the Google APIs that we want
   * to use, e.g. ['http://mail.google.com']
   * @param {String} tokenPath File path to read/write token data generated by
   * Google.
   */
  constructor(scopes, tokenPath) {
    this.scopes = scopes;
    this.tokenPath = tokenPath;

    const apiConfigs
      = JSON.parse(fs.readFileSync(__dirname + '/../../config/config.json'));

    this.CLIENT_ID = apiConfigs.googleApiKeys.CLIENT_ID;
    this.CLIENT_SECRET = apiConfigs.googleApiKeys.CLIENT_SECRET;
    this.REDIRECT_URIS = apiConfigs.googleApiKeys.REDIRECT_URIS;
    this.USER = apiConfigs.googleApiKeys.USER;
    this.REFRESH_TOKEN = apiConfigs.googleApiKeys.REFRESH_TOKEN;

    this.oAuth2Client = new google.auth.OAuth2(
      this.CLIENT_ID,
      this.CLIENT_SECRET,
      this.REDIRECT_URIS[0]
    );

    if (this.REFRESH_TOKEN !== 'NOT_SET') {
      this.oAuth2Client.setCredentials({
        // eslint-disable-next-line
        refresh_token: this.REFRESH_TOKEN
      });
    }

    if(apiConfigs.googleApiKeys.ENABLED) {
      this.hasValidAPIKeys = true;
    }
  }

  /**
   * Checks if the token file from the given path from the constructor exists.
   * It will either resolve a boolean false or an object containing the token
   * data.
   * @returns {Promise<boolean|Object>} The result of the token file search.
   */
  checkIfTokenFileExists() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.tokenPath, (err, token) => {
        if (err) {
          resolve(false);
        } else {
          resolve(JSON.parse(token));
        }
      });
    });
  }

  /**
   * This function prompts the user to visit the OAuth playground on Google
   * Cloud's website to supply an authorization code to it. After recieving the
   * code the function writes a JSON token the token file path;
   * @param {boolean} isDevScript toggles this functions context: true for
   * DevOps purposes, false for API endpoints.
   */
  getNewToken(isDevScript) {
    if (!isDevScript) return;

    const authUrl = this.oAuth2Client.generateAuthUrl({
      /* eslint-disable-next-line */
      access_type: 'offline',
      scope: this.scopes,
    });
    console.debug('\nAuthorize this app by visiting this URL:\n' + authUrl);

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('\nPlease enter the \'Authorization Code\' from the URL here: ',
      authCode => {
        rl.close();
        this.oAuth2Client.getToken(authCode, (err, token) => {
          if (err) {
            console.debug(redColor +
              'Error generating token', err + defaultColor
            );
            console.debug(`${redColor}Please re-run the script${defaultColor}`);
            return;
          }
          this.oAuth2Client.setCredentials(token);

          const configPath = __dirname + '/../../config/config.json';
          let config = JSON.parse(fs.readFileSync(configPath));
          config.googleApiKeys.REFRESH_TOKEN = token.refresh_token;

          fs.writeFile(configPath, JSON.stringify(config), (error) => {
            if (error) {
              return console.debug(
                `A problem occurred trying to write to ${configPath}`, error
              );
            }
            console.debug(greenColor +
              'Successfully wrote config data to:', configPath + defaultColor
            );
          });



          // Store the token to disk for later program executions
          console.debug(`\nGenerating token.js file to ${this.tokenPath}...`);
          fs.writeFileSync(this.tokenPath, JSON.stringify(token));
          console.debug(greenColor +
            'Done! You are ready to use GCP!' + defaultColor
          );
        });
      });
  }

  /**
   * Check if a token object is expired based on its expiry_date field.
   * @param {Object} token the token to check.
   */
  checkIfTokenIsExpired(token) {
    return Date.now() >= token.expiry_date;
  }

  /**
   * This function refreshes a Google API token if it is found to be expired.
   */
  refreshToken() {
    this.oAuth2Client.setCredentials({
      // eslint-disable-next-line
      refresh_token: this.REFRESH_TOKEN
    });

    this.oAuth2Client.getAccessToken().then(token => {
      fs.writeFile(this.tokenPath, JSON.stringify(token.res.data), err => {
        if (err) {
          logger.error('unable to refresh token', err);
        }
      });
    });
  }


  /**
 * Sends an email from sce.sjsu@gmail.com. The parameter defines recipient,
 * subject and email body.
 * @param {nodemailer.envelope} mailTemplate The email template to send.
 */
  async sendEmail(mailTemplate) {
    return new Promise(async (resolve, reject) => {
      if (!this.hasValidAPIKeys) {
        logger.warn(
          'we do not have valid api keys so we are skipping sending an email'
        );
        return resolve(true);
      }
      const smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: this.USER,
          clientId: this.CLIENT_ID,
          clientSecret: this.CLIENT_SECRET,
          refreshToken: this.REFRESH_TOKEN,
        },
      });

      smtpTransport.sendMail(mailTemplate, (error, response) => {
        smtpTransport.close();
        if (error) {
          logger.error('sendMail returned an error:', error);
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }
  /**
 * Adds responses from officer app form to a google spreadsheet
 * @param {String} sheetsId spreadsheet id for the spreadsheet to add to
 * @param {object} data response data from the officer application form
 */
  async writeToForm(sheetsId, data){
    if (!this.hasValidAPIKeys) {
      return resolve(true);
    }
    return new Promise(async (resolve, reject)=>{
      GoogleSpreadsheet.openById(sheetsId, (error, response) => {
        if (error){
          reject(false);
        }
      });
      const doc = new GoogleSpreadsheet(sheetsId);
      this.checkIfTokenFileExists(this.tokenPath, (error, response)=> {
        if(error){
          reject(false);
        }
      });
      await doc.useServiceAccountAuth(require(this.tokenPath));
      await doc.loadInfo();
      const sheet = doc.sheetsByIndex[0];
      const row = {
        Name: data.name,
        Email: data.email,
        'Graduation Month': data.gradMonth,
        'Graduation Year': data.gradYear,
        'Work Experience': data.experience,
        LinkedIn: data.linkedin
      };
      sheet.addRow(row, (error, response) => {
        if(error){
          reject(false);
        } else{
          resolve(response);
        }
      });
    });
  }
}

module.exports = { SceGoogleApiHandler };
