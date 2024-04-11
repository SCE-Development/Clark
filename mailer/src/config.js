
const path = require("path");

const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const PORT = 4234;
const HOSTNAME = "localhost";
const BASE_URL = `http://${HOSTNAME}:${PORT}/`
const PUBLIC_DIR = path.join(__dirname, "../public");
const TMP_DIR = path.join(__dirname, "tmp")
const GOOGLE_TOKEN_FILE = path.join(TMP_DIR, "token-google.json");

const Config = {
    get() {

        const rl = readline.createInterface({ input, output });

        rl.question('What do you think of Node.js? ', (answer) => {
          // TODO: Log the answer in a database
          console.log(`Thank you for your valuable feedback: ${answer}`);
        
          rl.close();
        });
    },
    TMP_DIR,
    GOOGLE_TOKEN_FILE,
    PUBLIC_DIR,
    PORT,
    HOSTNAME,
    BASE_URL

};

module.exports = { Config }