const express = require("express");
const path = require("path");
const { Config } = require("../config");

const { Google } = require("../google");
const { VerificationEmail } = require("../templates/verification-email");
const { BlastEmail } = require("../templates/blast-email");

const router = express.Router();

router.use(express.json());
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