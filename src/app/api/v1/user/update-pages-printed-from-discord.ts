
router.post('/updatePagesPrintedFromDiscord', (req, res) => {
    const { discordID, apiKey, pagesPrinted } = req.body;
    if(!checkDiscordKey(apiKey)){
      return res.sendStatus(UNAUTHORIZED);
    }
    User.updateOne( { discordID }, {pagesPrinted},
      (error, result) => {
        let status = OK;
        if(error){
          status = BAD_REQUEST;
        } else if (result.n === 0){
          status = NOT_FOUND;
        }
        return res.sendStatus(status);
      });
  });
  