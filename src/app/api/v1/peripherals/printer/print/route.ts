
router.post('/sendPrintRequest', async (req, res) => {
    if (!checkIfTokenSent(req)) {
      logger.warn('/sendPrintRequest was requested without a token');
      return res.sendStatus(UNAUTHORIZED);
    }
    if (!await verifyToken(req.body.token)) {
      logger.warn('/sendPrintRequest was requested with an invalid token');
      return res.sendStatus(UNAUTHORIZED);
    }
    if (!PRINTING.ENABLED) {
      logger.warn('Printing is disabled, returning 200 to mock the printing server');
      return res.sendStatus(OK);
    }
  
    const { raw, copies, pageRanges, sides } = req.body;
    axios
      .post(PRINTER_URL + '/print', {
        raw,
        copies,
        pageRanges,
        sides,
      })
      .then(() => {
        res.sendStatus(OK);
      }).catch((err) => {
        logger.error('/sendPrintRequest had an error: ', err);
        res.sendStatus(SERVER_ERROR);
      });
  });