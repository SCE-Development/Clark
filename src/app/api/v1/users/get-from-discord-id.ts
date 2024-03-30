
router.post('/getUserFromDiscordId', (req, res) => {
    const { discordID, apiKey } = req.body;
    if(!checkDiscordKey(apiKey)){
      return res.sendStatus(UNAUTHORIZED);
    }
    User.findOne({ discordID }, (error, result) => {
      let status = OK;
      if (error) {
        status = BAD_REQUEST;
      } else if (!result) {
        status = NOT_FOUND;
      }
      return res.status(status).send(result);
    });
  });
  