const google = require("googleapis");
const fs = require("fs/promises");
const secret = require("./secrets");
const { Config } = require("./config");
const nodemailer = require("nodemailer");
const Mail = require("nodemailer/lib/mailer");

/**
 * This class handles the google OAuth2.0 Sessions.
 */
class GoogleAuthenticationHandler {
    constructor() {
        this.clientId = secret.CLIENT_ID;
        this.clientSecret = secret.CLIENT_SECRET
        this.oauth2 = new google.Auth.OAuth2Client(
            this.clientId, 
            this.clientSecret,
            new URL("/v1/oauth2/google/grant", Config.BASE_URL).href // Redirect URL
        );
        /** @type {google.Auth.Credentials|null} */
        this.token = null;
    }
    /**
     * Generate an auth url that the user can use to authenticate with gmail.
     * @returns The generated auth url.
     */
    generateUrl() {
        return this.oauth2.generateAuthUrl({
            access_type: 'offline',
            scope: ["https://mail.google.com"]
        });
    }
    /**
     * Get token from the authentication code passed from the redirect url and save it in the session.
     * @param {string} code The authentication code passed in the query parameters of the redirect url.
     */
    async getToken(code) {
        const token = (await this.oauth2.getToken(code)).tokens;
        this.saveToken(token);
    }

    /**
     * Save a token to the file system token file so it can be used later.
     * 
     * The token file is specified with `Config.GOOGLE_TOKEN_FILE`
     * 
     * @param {google.Auth.Credentials} token OAuth2.0 Credentials
     */
    async saveToken(token) {
        this.setToken(token);
        await fs.mkdir(Config.TMP_DIR, { recursive: true });
        await fs.writeFile(Config.GOOGLE_TOKEN_FILE, JSON.stringify(token), "utf-8");
        console.info(`Saved token in "${Config.GOOGLE_TOKEN_FILE}"`);
    }
    /**
     * Set the current session token.
     * @param {google.Auth.Credentials} token OAuth2.0 Credentials
     */
    async setToken(token) {
        console.log(token);
        this.token = token;
        this.oauth2.setCredentials(this.token);
    }
    /**
     * Load a token from the token file, if valid.
     */
    async loadToken() {
        try {
            const token = JSON.parse(await fs.readFile(Config.GOOGLE_TOKEN_FILE, "utf-8"));
            this.setToken(token);
            console.log(`Loaded previous token.`);
        }catch(e) {
            console.warn(`Couldn't find token, reauthenticate here "${new URL("v1/oauth2/google/authenticate", Config.BASE_URL).href}"`);
        }
    }
    /**
     * Refresh the token using the refresh token.
     */
    async refresh() {
        if(!this.token) {
            throw "Token invalid.";
        }
        const token = await this.oauth2.getAccessToken();
        this.saveToken(token);
    }
}

/**
 * This class handles interaction with the gmail api.
 */
class GmailHandler {
    /**
     * Pass the OAuth2.0 session handler.
     * @param {GoogleAuthenticationHandler} auth the OAuth2.0 session handler.
     */
    constructor(auth) {
        this.auth = auth;
        this.user = secret.EMAIL
    }

    /**
     * Send an email.
     * 
     * @param {Mail.Options} envelope Email to send
     */
    send(envelope) {
        envelope.from = this.user;
        // console.log(this.auth);
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: this.user,
                clientId: this.auth.clientId,
                clientSecret: this.auth.clientSecret,
                accessToken: this.auth.token.access_token,
            }
        });
        return transport.sendMail(envelope);
    }
}

const auth = new GoogleAuthenticationHandler();
const gmail = new GmailHandler(auth);

/**
 * Utility functions that handle interactions with the google api.
 */
const Google = {
    auth,
    gmail
};

module.exports = { Google }