
class BlastEmail {
    /**
     * 
     * @param {string|string[]} recipients 
     * @param {string} subject 
     * @param {string} content 
     */
    constructor(recipients, subject, content) {
        this.bcc = recipients;
        this.subject = subject;
        this.generateTextFromHTML = true;
        this.html = content;
    }
}

module.exports = {
    BlastEmail
}