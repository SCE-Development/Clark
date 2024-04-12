
class VerificationEmail {
    /**
     * 
     * @param {string} recipient 
     * @param {string} name 
     * @param {string} verifyLink 
     */
    constructor(recipient, name, verifyLink) {
        this.to = recipient;
        this.subject = "Please verify your email address";
        this.generateTextFromHTML = true;
        this.html = `Hi ${name || ''},<br />
        <p>Thanks for signing up!
        Please verify your email by clicking below.</p>
        <a href='${verifyLink}'>Verify Email</a>`;
    }
}

module.exports = {
    VerificationEmail
}