

router.post('/getUserById', async (req, res) => {
    if (!checkIfTokenSent(req)) {
      return res.sendStatus(FORBIDDEN);
    } else if (!checkIfTokenValid(req, (
      membershipState.OFFICER
    ))) {
      return res.sendStatus(UNAUTHORIZED);
    }
    User.findOne({ _id: req.body.userID}, (err, result) => {
      if (err) {
        return res.sendStatus(BAD_REQUEST);
      }
  
      if (!result) {
        return res.sendStatus(NOT_FOUND);
      }
  
      const { password, ...omittedPassword } = result._doc;
  
      return res.status(OK).json(omittedPassword);
    });
  });