const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
// const { googleApiKeys } = require('../../config/config.json');
const nodemailer = require('nodemailer');
const { consoleColors } = require('../../util/constants');
const { reject } = require('bluebird');
const { GoogleSpreadsheet } = require('google-spreadsheet');

// const {
//   REDIRECT_URIS,
//   USER, REFRESH_TOKEN
// } = googleApiKeys;

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
   * to use, e.g. ['http://mail.google.com', 'http://calendar.google.com',]
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
      this.CLIENT_ID,
      this.REDIRECT_URIS[0]
    );
    this.oAuth2Client.setCredentials({
      // eslint-disable-next-line
      refresh_token: this.REFRESH_TOKEN
    });
    if(this.CLIENT_ID != 'NOT_SET' && this.CLIENT_SECRET != 'NOT_SET') {
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
        if (err) return console.debug(err);
      });
    });
  }

  /**
   * Grabs all the events for a given calendar by its id.
   * will log the next 10 events into the console.
   * @param calendarId {string} calendar id for which calendar to pull from
   * @returns {{Array<Object>|Error)} The calendar events from Google or an
   * error.
   */
  getEventsFromCalendar(calendarId, numOfEvents) {
    return new Promise((resolve, reject) => {
      if (!this.hasValidAPIKeys) {
        return resolve(true);
      }
      const calendar =
        google.calendar({ version: 'v3', auth: this.oAuth2Client });
      calendar.events.list({
        calendarId: calendarId,
        timeMin: (new Date()).toISOString(),
        maxResults: numOfEvents,
        singleEvents: true,
        orderBy: 'startTime',
      }, (err, res) => {
        if (err) return reject(false);
        const events = res.data.items;
        if (events.length) {
          resolve(events);
        } else {
          reject(false);
        }
      });
    });
  }

  /**
   * Convert date in slash format to a date in dash format
   * @param {Date} slashDate with time in slash format Ex. 7/23/2020
   * @returns {string} time in dash format Ex. 2020-7-23
   */
  dash(slashDate) {
    const date = new Date(slashDate);
    if (!date) return;
    let myDateString = date.getFullYear() + '-'
      + ('0' + (date.getMonth() + 1)).slice(-2) + '-'
      + ('0' + (date.getDate() + 1)).slice(-2);
    return myDateString;
  }

  /**
   * Convert time in 12 hr format to a time in 24 hr format
   * @param {string} time12h in 12 hr format Ex. 3:11 PM
   * @returns {string} time in 24 hr format Ex. 15:11
   */
  to24(time12h) {
    if (!time12h) return;
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    } else if (parseInt(hours) < 10 && parseInt(hours) > 0) {
      hours = '0' + String(hours);
    }
    return `${hours}:${minutes}`;
  }

  /**
   * Convert SCE events to Google Calendar Events
   * @param {Object} eventToAdd An SCE Event Ex.
   * {
   *  title: 'Resume Workshop',
   *  description: 'Workshop to help others perfect their resumes'
   *  eventLocation: '1 Washington Sq, San Jose, CA 95192',
   *  eventDate: new Date('7/25/20'),
   *  startTime: '09:00',
   *  endTime: '17:00',
   *  eventCategory: 'Workshop',
   *  imageURL: 'https://link.to/pdf'
   * }
   * @returns {Object} A Google Calendar formatted event Ex.
   * {
   *  summary: 'Resume Workshop',
   *  location: '1 Washington Sq, San Jose, CA 95192',
   *  description: 'Workshop to help others perfect their resumes',
   *  start: {
   *    dateTime: '2020-07-25T09:00:00-07:00',
   *    timeZone: 'America/Los_Angeles'
   *  },
   *  end: {
   *    dateTime: '2020-07-25T17:00:00-07:00',
   *    timeZone: 'America/Los_Angeles'
   *  },
   *  recurrence: [
   *    'RRULE:FREQ=DAILY;COUNT=1'
   *  ],
   *  attendees: [],
   *  reminders: {
   *    useDefault: false,
   *    overrides: [
   *      {method: 'email', minutes: 24 * 60},
   *      {method: 'popup', minutes: 10}
   *    ]
   *  }
   * }
   */
  translateEvent(eventToAdd) {
    const event = {
      summary: eventToAdd.title,
      location: eventToAdd.eventLocation,
      description: eventToAdd.description,
      start: {
        dateTime: this.dash(eventToAdd.eventDate) + 'T'
        + this.to24(eventToAdd.startTime) + ':00-07:00',
        timeZone: 'America/Los_Angeles'
      },
      end: {
        dateTime: this.dash(eventToAdd.eventDate) + 'T'
        + this.to24(eventToAdd.endTime) + ':00-07:00',
        timeZone: 'America/Los_Angeles'
      },
      recurrence: [
        'RRULE:FREQ=DAILY;COUNT=1'
      ],
      attendees: [],
      reminders: {
        useDefault: false,
        overrides: [
          // Email reminder sent a day before event time
          {method: 'email', minutes: 24 * 60},
          // Popup reminder sent 10 minutes before event time
          {method: 'popup', minutes: 10}
        ]
      }
    };
    return event;
  }

  /**
   * Adds an event to a given calendar by its id.
   * @param calendarId {string} calendar id for which calendar to pull from
   * @param newEvent {Event} event to translate and add to Google Calendar
   */
  addEventToCalendar(calendarId, newEvent) {
    return new Promise((resolve, reject) => {
      if (!this.hasValidAPIKeys) {
        return resolve(true);
      }
      const calendar =
        google.calendar({ version: 'v3', auth: this.oAuth2Client });
      let eventToAdd = this.translateEvent(newEvent);
      calendar.freebusy.query({
        resource: {
          timeMin: eventToAdd.start.dateTime,
          timeMax: eventToAdd.end.dateTime,
          timeZone: eventToAdd.start.timeZone,
          items: [{ id: 'primary' }],
        },
      },
      (err, res) => {
        if(err) reject(err);
        const eventsArr = res.data.calendars.primary.busy;
        if(eventsArr.length === 0) {
          const response = calendar.events.insert({
            auth: this.oAuth2Client,
            calendarId: calendarId,
            resource: eventToAdd
          });
          resolve(eventToAdd);
        }
        reject(false);
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
        error ? reject(error) : resolve(response);
        smtpTransport.close();
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
