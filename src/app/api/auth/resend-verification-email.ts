// TODO

router.post('/resendVerificationEmail', async (req, res) => {
    if (!checkIfTokenSent(req)) {
      return res.sendStatus(FORBIDDEN);
    } else if (!checkIfTokenValid(req, membershipState.OFFICER)) {
      return res.sendStatus(UNAUTHORIZED);
    }
    const maybeUser = await userWithEmailExists(req.body.email);
    if (!maybeUser) {
      return res.sendStatus(NOT_FOUND);
    }
    let name = maybeUser.firstName + ' ' + maybeUser.lastName;
    sendVerificationEmail(name, req.body.email);
    res.sendStatus(OK);
  });
  