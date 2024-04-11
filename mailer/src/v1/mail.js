const express = require("express");
const path = require("path");
const { Config } = require("../config");

const { Google } = require("../google");
const { VerificationEmail } = require("../templates/verification-email");
const { BlastEmail } = require("../templates/blast-email");

const router = express.Router();

router.use(express.json());
router.post("/send-verification-email", async (req, res) => {
    await Google.gmail.send(new VerificationEmail(req.body.email, req.body.name, req.body.verifyLink));
    res.json({ success: true });
});

router.post('/send-blast-email', async (req, res) => {
    await Google.gmail.send(new BlastEmail(req.body.recipients, req.body.subject, req.body.content));
    res.json({ success: true });
});

module.exports = router;