
const path = require("path");

/** Port to listen on */
const PORT = 4234;
/** Hostname of this server */
const HOSTNAME = "localhost";
/** Base URL of this server */
const BASE_URL = `http://${HOSTNAME}:${PORT}/`
/** Public Directory. Holds template html files and stuff */
const PUBLIC_DIR = path.join(__dirname, "../public");
/** tmp Directory. Holds runtime token files. */
const TMP_DIR = path.join(__dirname, "tmp")
/** Google Token File, stored in the tmp directory. Holds a previously saved access token*/
const GOOGLE_TOKEN_FILE = path.join(TMP_DIR, "token-google.json");

const Config = {
    TMP_DIR,
    GOOGLE_TOKEN_FILE,
    PUBLIC_DIR,
    PORT,
    HOSTNAME,
    BASE_URL
};

module.exports = { Config }
