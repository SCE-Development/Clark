/**
 * Endpoints that handle OAuth2.0 token grants and redirects.
 */

const express = require("express");
const path = require("path");
const { Config } = require("../config");

const { Google } = require("../google");

const TOKEN_GRANT_CONFIRMATION_FILE = path.join(Config.PUBLIC_DIR, "token-grant.html");

/**
 * Endpoints that handle OAuth2.0 token grants and redirects.
 */
const router = express.Router();

/**
 * Generate a Google Auth URL and redirect to it. Use this to grant access
 * to the SCE Email account.
 */
router.get("/google/authenticate", (req, res) => {
    res.redirect(Google.auth.generateUrl());
});

/**
 * Redirect that extracts the authorization code from the query parameters and configures the session.
 */
router.get("/google/grant", async (req, res) => {
    await Google.auth.getToken(req.query.code);
    res.sendFile(TOKEN_GRANT_CONFIRMATION_FILE)
});

router.get("/github/authenticate", (req, res) => {
    
});

router.get("/github/grant", (req, res) => {
    
});

module.exports = router;