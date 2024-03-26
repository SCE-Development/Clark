
// Search for all members with verified emails and subscribed
router.post('/usersSubscribedAndVerified', function(req, res) {
    if (!checkIfTokenSent(req)) {
      return res.sendStatus(FORBIDDEN);
    } else if (!checkIfTokenValid(req)) {
      return res.sendStatus(UNAUTHORIZED);
    }
    User.find({ emailVerified: true, emailOptIn: true })
      .then((users) => {
        if (users.length) {
          const userEmailAndName = users.map((user) => {
            return {
              email : user.email,
              firstName : user.firstName,
              lastName : user.lastName
            };
          });
          sendUnsubscribeEmail(userEmailAndName);
        }
        return res.sendStatus(OK);
      })
      .catch((err) => {
        res.status(BAD_REQUEST).send({ message: 'Bad Request.' });
      });
  });
  