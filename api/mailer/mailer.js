const nodemailer = require('nodemailer');
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const path = require('path');
const config = require('../config/config');

// Mailer templates
const verification = require('./templates/verification');
const test = require('./templates/test');

const SCOPES = ['https://mail.google.com/'];
const TOKEN_PATH = path.join(__dirname, '../config/token.json');

const dev = process.env.NODE_ENV !== 'production';

const { CLIENT_SECRET, CLIENT_ID, REDIRECT_URIS, USER } = config.mailer;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URIS[0]
);

// Check if we have previously stored a token.
fs.readFile(TOKEN_PATH, (err, token) => {
  if (err) return getNewToken(oAuth2Client);

  if (checkIfTokenIsExpired(JSON.parse(token))) refreshAccessToken();

  oAuth2Client.setCredentials(JSON.parse(token));
});

function getNewToken(oAuth2Client) {
  if (dev) return;

  const authUrl = oAuth2Client.generateAuthUrl({
    // eslint-disable-next-line
    access_type: 'offline',
    // Uncomment the following to get a refresh token
    // prompt: 'consent',
    scope: SCOPES
  });
  // console.log('Authorize this app by visiting this url:', authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter the code from that page here: ', code => {
    rl.close();

    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
        if (err) return console.error('ERR', err);
        // console.log('Token stored to', TOKEN_PATH);
      });
    });
  });
}

function checkIfTokenIsExpired(token) {
  return Date.now() >= token.expiry_date;
}

function getMailTemplate(templateType, recipientEmail, recipientName) {
  return new Promise((resolve, reject) => {
    switch (templateType) {
    case 'verification':
      verification(USER, recipientEmail, recipientName).then(res => {
        resolve(res);
      });
      break;

    default:
      resolve(test(USER, recipientEmail, recipientName));
    }
  });
}

function refreshAccessToken() {
  oAuth2Client.setCredentials({
    // eslint-disable-next-line
    refresh_token: config.mailer.REFRESH_TOKEN
  });

  oAuth2Client.getAccessToken().then(token => {
    fs.writeFile(TOKEN_PATH, JSON.stringify(token.res.data), err => {
      if (err) return console.error(err);
    });
  });
}

const send = ({ templateType, recipientEmail, recipientName }) => {
  return new Promise((resolve, reject) => {
    getMailTemplate(templateType, recipientEmail, recipientName).then(
      mailTemplate => {
        function callback(token) {
          const smtpTransport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              type: 'OAuth2',
              user: USER,
              clientId: CLIENT_ID,
              clientSecret: CLIENT_SECRET,
              accessToken: token.access_token
            }
          });

          if (process.env.NODE_ENV === 'production') {
            smtpTransport.sendMail(mailTemplate, (error, response) => {
              error ? reject(error) : resolve(response);
              smtpTransport.close();
            });
          } else {
            // console.log('DEV - Mail:');
            // console.log(mailTemplate);
            resolve();
          }
        }

        fs.readFile(TOKEN_PATH, (err, token) => {
          if (err) reject(err);

          // This needs a .then or async statement so 
          // it doesnt move until a new access token is created
          if (checkIfTokenIsExpired(JSON.parse(token))) refreshAccessToken();
          else callback(JSON.parse(token));
        });
      }
    );
  }).catch(error => reject(error));
};

module.exports = {
  send
};
