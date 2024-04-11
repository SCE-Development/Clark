const google = require("googleapis");
const fs = require("fs/promises");
const secret = require("./secrets");
const { Config } = require("./config");
const nodemailer = require("nodemailer");
const Mail = require("nodemailer/lib/mailer");

class GoogleAuthenticationHandler {
    constructor() {
        this.clientId = secret.CLIENT_ID;
        this.clientSecret = secret.CLIENT_SECRET
        this.oauth2 = new google.Auth.OAuth2Client(
            this.clientId, 
            this.clientSecret,
            new URL("/v1/oauth2/google/grant", Config.BASE_URL).href
        );
        /** @type {google.Auth.Credentials|null} */
        this.token = null;
    }
    generateUrl() {
        return this.oauth2.generateAuthUrl({
            access_type: 'offline',
            scope: ["https://mail.google.com"]
        });
    }
    async getToken(code) {
        const token = (await this.oauth2.getToken(code)).tokens;
        this.saveToken(token);
    }
    async saveToken(token) {
        this.setToken(token);
        await fs.mkdir(Config.TMP_DIR, { recursive: true });
        await fs.writeFile(Config.GOOGLE_TOKEN_FILE, JSON.stringify(token), "utf-8");
        console.info(`Saved token in "${Config.GOOGLE_TOKEN_FILE}"`);
    }
    async setToken(token) {
        console.log(token);
        this.token = token;
        this.oauth2.setCredentials(this.token);
    }
    async loadToken() {
        try {
            const token = JSON.parse(await fs.readFile(Config.GOOGLE_TOKEN_FILE, "utf-8"));
            this.setToken(token);
            console.log(`Loaded previous token.`);
        }catch(e) {
            console.warn(`Couldn't find token, reauthenticate here "${new URL("v1/oauth2/google/authenticate", Config.BASE_URL).href}"`);
        }
    }
    async refresh() {
        if(!this.token) {
            throw "Token invalid.";
        }
        const token = await this.oauth2.getAccessToken();
        this.saveToken(token);
    }
}

class GmailHandler {
    /**
     * 
     * @param {GoogleAuthenticationHandler} auth 
     */
    constructor(auth) {
        this.auth = auth;
        this.user = secret.EMAIL
    }

    /**
     * 
     * @param {Mail.Options} envelope 
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

const Google = {
    auth,
    gmail
};

module.exports = { Google }