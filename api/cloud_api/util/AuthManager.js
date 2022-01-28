const fs = require('fs');
const readline = require('readline');
const { consoleColors } = require('../../util/constants');

const {
  redColor,
  greenColor,
  blueColor,
  yellowColor,
  defaultColor
} = consoleColors;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

/**
 * Handles the gathering and writing
 * of Google API credentials
 */
class AuthManager {
  /**
   * Prompts user for input and resolves the input or false
   * @param {String} prompt question to get the info we need
   */
  inputPrompt(prompt) {
    return new Promise((resolve, reject) => {
      rl.question(prompt, (ans) => {
        if(ans !== '') {
          resolve(ans);
        } else {
          resolve(false);
        }
      });
    });
  }

  /**
   * Prompts user for client ID & secret and writes them to config
   * file containing auth credentials for various google APIs
   * @param {String} configPath the directory path of the config.json file
   * @param {function} callback a function to run in sync after successful write
   */
  async setAuthCredentials(configPath, callback) {
    console.debug(blueColor +
      'Welcome to SCE\'s Google Cloud API Token Generator!\n'
    );
    console.debug(
      yellowColor +
      'Don\'t know what to do or how this works?\n' +
      /* eslint-disable-next-line */
      'Please visit: https://github.com/SCE-Development/Core-v4/wiki/Getting-Started#setting-up-mailer\n' + 
      defaultColor
    );

    const configFileData = fs.readFileSync(configPath);

    if (configFileData) {
      let config = JSON.parse(configFileData);

      let input = '';
      if (config.googleApiKeys.CLIENT_ID !== 'NOT_SET') {
        console.debug(
          `Current Client ID: ${yellowColor}` /
          `${config.googleApiKeys.CLIENT_ID}${defaultColor}`
        );
        while ((input.toLocaleLowerCase() !== 'y') &&
               (input.toLocaleLowerCase() !== 'n')) {
          input = await this.inputPrompt(
            'Do you want to enter a new Client ID (Y/N)? '
          );
        }
      }
      let clientID;
      if (input.toLocaleLowerCase() !== 'n') {
        clientID = await this.inputPrompt(
          'Please enter the Client ID: '
        );
        config.googleApiKeys.CLIENT_ID = clientID;
      }

      // if (clientID) {
      //   config.googleApiKeys.CLIENT_ID = clientID;
      // } else {
      //   console.debug(
      //     greenColor + `defaulting to ${config.googleApiKeys.CLIENT_ID}`
      //     + defaultColor
      //   );
      // }

      // const clientSecret = await this.inputPrompt(
      //   'Please enter the Client Secret (press enter to skip): '
      // );
      // if (clientSecret) {
      //   config.googleApiKeys.CLIENT_SECRET = clientSecret;
      // } else {
      //   console.debug(
      //     greenColor + `defaulting to ${config.googleApiKeys.CLIENT_SECRET}`
      //     + defaultColor
      //   );
      // }

      input = '';
      if (config.googleApiKeys.CLIENT_SECRET !== 'NOT_SET') {
        console.debug(
          `Current Client Secret: ${config.googleApiKeys.CLIENT_SECRET}`
        );
        while ((input.toLocaleLowerCase() !== 'y') &&
               (input.toLocaleLowerCase() !== 'n')) {
          input = await this.inputPrompt(
            'Do you want to enter a new Client ID (Y/N)? '
          );
        }
      }
      let clientSecret;
      if (input.toLocaleLowerCase() !== 'n') {
        clientSecret = await this.inputPrompt(
          'Please enter the Client Secret: '
        );
        config.googleApiKeys.CLIENT_SECRET = clientSecret;
      }

      fs.writeFile(configPath, JSON.stringify(config), (error) => {
        if (error) {
          return console.debug(
            `A problem occurred trying to write to ${configPath}`, error
          );
        }

        console.debug(greenColor +
          'Successfully wrote config data to:', configPath + defaultColor
        );
        callback();
      });
    } else {
      console.debug(redColor +
        'config.json file does not exist at path:', configPath + defaultColor
      );
    }
  }
}

module.exports = { AuthManager };
