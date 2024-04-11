const express = require("express");
const path = require("path");
const { Config } = require("../config");

const { Google } = require("../google");

const TOKEN_GRANT_CONFIRMATION_FILE = path.join(Config.PUBLIC_DIR, "token-grant.html");
const router = express.Router();

router.get("/google/authenticate", (req, res) => {
    res.redirect(Google.auth.generateUrl());
});
router.get("/google/grant", async (req, res) => {
    await Google.auth.getToken(req.query.code);
    res.sendFile(TOKEN_GRANT_CONFIRMATION_FILE)
});

router.get("/github/authenticate", (req, res) => {
    
});

router.get("/github/grant", (req, res) => {
    
});

module.exports = router;