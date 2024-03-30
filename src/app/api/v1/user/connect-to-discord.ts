
router.post('/connectToDiscord', function(req, res) {
    const email = req.body.email;
    if (!checkIfTokenSent(req)) {
      return res.sendStatus(FORBIDDEN);
    } else if (!checkIfTokenValid(req)) {
      return res.sendStatus(UNAUTHORIZED);
    }
    if (!email) {
      return res.sendStatus(BAD_REQUEST);
    }
    if (!discordApiKeys.ENABLED) {
      return res.sendStatus(OK);
    }
    return res.status(OK)
      .send('https://discord.com/api/oauth2/authorize?client_id=' +
        `${discordApiKeys.CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(discordRedirectUri)}` +
        `&state=${email}&response_type=code&scope=identify`
      );
  });