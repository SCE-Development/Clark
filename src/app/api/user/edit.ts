
// Edit/Update a member record
router.post('/edit', async (req, res) => {
    if (!checkIfTokenSent(req)) {
      return res.sendStatus(FORBIDDEN);
    } else if (!checkIfTokenValid(req)) {
      return res.sendStatus(UNAUTHORIZED);
    }
  
    if (!req.body._id) {
      return res.sendStatus(BAD_REQUEST);
    }
  
    let decoded = decodeToken(req);
    if (decoded.accessLevel === membershipState.MEMBER) {
      if (req.body.email && req.body.email != decoded.email) {
        return res
          .status(UNAUTHORIZED)
          .send('Unauthorized to edit another user');
      }
      if (req.body.accessLevel && req.body.accessLevel !== decoded.accessLevel) {
        return res
          .status(UNAUTHORIZED)
          .send('Unauthorized to change access level');
      }
    }
  
    if (decoded.accessLevel === membershipState.OFFICER) {
      if (req.body.accessLevel && req.body.accessLevel == membershipState.ADMIN) {
        return res.sendStatus(UNAUTHORIZED);
      }
    }
  
    const query = { _id: req.body._id };
    let user = req.body;
  
    if (typeof req.body.numberOfSemestersToSignUpFor !== 'undefined') {
      user.membershipValidUntil = getMemberExpirationDate(
        parseInt(req.body.numberOfSemestersToSignUpFor)
      );
    }
  
    delete user.numberOfSemestersToSignUpFor;
  
    if (!!user.password) {
      // hash the password before storing
      const result = await hashPassword(user.password);
      if (!result) {
        return res.sendStatus(SERVER_ERROR);
      }
      user.password = result;
    } else {
      // omit password from the object if it is falsy
      // i.e. an empty string, undefined or null
      delete user.password;
    }
  
    // Remove the auth token from the form getting edited
    delete user.token;
  
    User.updateOne(query, { ...user }, function(error, result) {
      if (error) {
        const info = {
          errorTime: new Date(),
          apiEndpoint: 'user/edit',
          errorDescription: error
        };
  
        res.status(BAD_REQUEST).send({ message: 'Bad Request.' });
      }
  
      if (result.nModified < 1) {
        return res
          .status(NOT_FOUND)
          .send({ message: `${query.email} not found.` });
      }
      return res.status(OK).send({
        message: `${query.email} was updated.`,
        membershipValidUntil: user.membershipValidUntil
      });
    });
  });
  