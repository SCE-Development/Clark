
router.get('/healthCheck', async (req, res) => {
    /*
     * How these work with Quasar:
     * https://github.com/SCE-Development/Quasar/wiki/How-do-Health-Checks-Work%3F
     */
      if (!PRINTING.ENABLED) {
        logger.warn('Printing is disabled, returning 200 to mock the printing server');
        return res.sendStatus(OK);
      }
      await axios
        .get(PRINTER_URL + '/healthcheck/printer')
        .then(() => {
          return res.sendStatus(OK);
        })
        .catch((err) => {
          logger.error('Printer SSH tunnel is down: ', err);
          return res.sendStatus(NOT_FOUND);
        });
    });