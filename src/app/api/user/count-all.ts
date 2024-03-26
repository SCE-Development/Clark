
router.get('/countAllUsers', async (req, res) => {
    if (!checkIfTokenSent(req)) {
      return res.sendStatus(FORBIDDEN);
    } else if (!checkIfTokenValid(req, (
      membershipState.OFFICER
    ))) {
      return res.sendStatus(UNAUTHORIZED);
    }
    const search = req.query.search;
    let status = OK;
    const count = await User.find({
      $or:
        [
          { 'firstName': { '$regex': search, '$options': 'i' } },
          { 'lastName': { '$regex': search, '$options': 'i' } },
          { 'email': { '$regex': search, '$options': 'i' } }
        ]
    }, function(error, result) {
      if (error) {
        status = BAD_REQUEST;
      } else if (result == 0) {
        status = NOT_FOUND;
      }
    }).countDocuments();
    const response = {
      count
    };
    res.status(status).json(response);
  });