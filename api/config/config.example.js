// Copy the contents of this file into a config.js in this same directory

// This variable keeps track if the current environment is being
// tested or not
const TEST_ENV = process.env.NODE_ENV === 'test';
// This variable holds an empty string and is assigned to URL values
// below as if we are testing, we don't need to fully write out the
// path.
const TEST_URL = '';

module.exports = {
  // secretKey is used to generate a unique jwtToken
  // This key should be changed from it's default to a mix of
  // random characters, numbers and symbols. At least 25 characters long
  // To generate a random key, visit https://www.lastpass.com/password-generator
  secretKey: 'super duper secret key',

  // Sets the required strength. Default is 'strong'
  // strong:
  // Contains at least 1 lowercase alphabetical character
  // Contains at least 1 uppercase alphabetical character
  // Contain at least 1 numeric character
  // Contain at least one special character: !@#\$%\^&
  // The string must be at least eight characters or longer

  // medium:
  // Contains at least 1 lowercase alphabetical character and
  // at least 1 uppercase alphabetical character or
  // contains at least one lowercase alphabetical character and
  // at least 1 numeric character or
  // contains at least one uppercase alphabetical character and
  // at least 1 numeric character
  // The string must be at least six characters or longer
  passwordStrength: 'medium',
  // weak:
  // Unrestricted passwords allowed
  // Configuration for the mailer client
  // The secret and ID is found in the google account API services
  // The refresh token is created at the OAuth2 Playground
  // Example for how to generate:
  // https://medium.com/@nickroach_50526/sending-emails-
  // with-node-js-using-smtp-gmail-and-oauth2-316fe9c790a1
  googleApiKeys: {
    CLIENT_SECRET: 'XXXXXXXXXXXXXXXXXXXX',
    CLIENT_ID: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    REDIRECT_URIS: ['https://developers.google.com/oauthplayground'],
    USER: 'sce.sjsu@gmail.com',
    REFRESH_TOKEN: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
  },
  googleCalendarIds: {
    PRIMARY_CAL: 'primary',
    SCE_EVENTS_CAL: 'XXXXXXXXXXXXXXXXXXXXXXXXXXX'
  },
  // The ip address of the sign. You can find it by running `ifconfig` on the pi
  ledSignIp: '192.168.4.1',
  TEST_ENV: process.env.NODE_ENV === 'test',
  GENERAL_API_URL: TEST_ENV ? TEST_URL : 'http://localhost:8080/',
  LOGGING_API_URL: TEST_ENV ? TEST_URL : 'http://localhost:8081/',
  MAILER_API_URL: TEST_ENV ? TEST_URL : 'http://localhost:8082/'
};
