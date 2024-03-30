

router.get('/callback', async function(req, res) {
    const code = req.query.code;
    const email = req.query.state;
    discordConnection.loginWithDiscord(code, email, discordRedirectUri)
      .then(status => {
        return res.status(OK).redirect('https://discord.com/oauth2/authorized');
      })
      .catch(_ => {
        return res.status(NOT_FOUND).send('Authorization unsuccessful!');
      });
  });
  