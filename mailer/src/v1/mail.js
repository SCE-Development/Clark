/**
 * Endpoints that handle sending verification and blast emails.
 */

const express = require("express");
const path = require("path");
const { Config } = require("../config");

const { Google } = require("../google");
const { VerificationEmail } = require("../templates/verification-email");
const { BlastEmail } = require("../templates/blast-email");

/**
 * Endpoints that handle sending verification and blast emails.
 */
const router = express.Router();

router.use(express.json());

/**
 * Send a verification email
 * 
 * @typedef {{
 *  email: string,
 *  name: string,
 *  verifyLink: string
 * }} RequestBody
 */
router.post("/send-verification-email", async (req, res) => {
    console.log(req.body);
    try {
        await Google.gmail.send(new VerificationEmail(req.body.email, req.body.name, req.body.verifyLink));
        res.json({ success: true });
    }catch(e) {
        console.error(e);
        res.status(500).json({ success: false });
    }
});


/**
 * Send a blast email
 * 
 * @typedef {{
*  recipients: string|string[],
*  subject: string,
*  content: string
* }} RequestBody
*/
router.post('/send-blast-email', async (req, res) => {
    try {
        await Google.gmail.send(new BlastEmail(req.body.recipients, req.body.subject, req.body.content));
        res.json({ success: true });
    }catch(e) {
        console.error(e);
        res.status(500).json({ success: false });
    }
});

module.exports = router;