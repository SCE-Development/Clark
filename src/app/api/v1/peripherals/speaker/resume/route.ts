

router.post('/resume', async (req, res) => {
    const { path } = req.route;
    if (!checkIfTokenSent(req)) {
      logger.warn(`${path} was requested without a token`);
      return res.sendStatus(UNAUTHORIZED);
    }
    if (!await verifyToken(req.body.token)) {
      logger.warn(`${path} was requested with an invalid token`);
      return res.sendStatus(UNAUTHORIZED);
    }
    const result = await sendSpeakerRequest(path);
    if (result) {
      return res.sendStatus(OK);
    }
    return res.sendStatus(SERVER_ERROR);
  });