

// Search for a member
router.post('/search', function(req, res) {
    if (!checkIfTokenSent(req)) {
      return res.sendStatus(FORBIDDEN);
    } else if (!checkIfTokenValid(req, membershipState.ALUMNI)) {
      return res.sendStatus(UNAUTHORIZED);
    }
    User.findOne({ email: req.body.email }, function(error, result) {
      if (error) {
        res.status(BAD_REQUEST).send({ message: 'Bad Request.' });
      }
  
      if (!result) {
        return res
          .status(NOT_FOUND)
          .send({ message: `${req.body.email} not found.` });
      }
  
      const user = {
        firstName: result.firstName,
        middleInitial: result.middleInitial,
        lastName: result.lastName,
        email: result.email,
        emailVerified: result.emailVerified,
        emailOptIn: result.emailOptIn,
        discordUsername: result.discordUsername,
        discordDiscrim: result.discordDiscrim,
        discordID: result.discordID,
        active: result.active,
        accessLevel: result.accessLevel,
        major: result.major,
        joinDate: result.joinDate,
        lastLogin: result.lastLogin,
        membershipValidUntil: result.membershipValidUntil,
        pagesPrinted: result.pagesPrinted,
        doorCode: result.doorCode,
        _id: result._id
      };
      return res.status(OK).send(user);
    });
  });
  