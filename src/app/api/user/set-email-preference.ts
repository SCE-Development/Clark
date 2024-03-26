
router.post('/setUserEmailPreference', (req, res) => {
    const email = req.body.email;
    const emailOptIn = !!req.body.emailOptIn;
  
    User.updateOne(
      { email: email },
      { emailOptIn: emailOptIn },
      function(error, result) {
        if (error) {
          res.status(BAD_REQUEST).send({ message: 'Bad Request.' });
        }
  
        if (result.n === 0) {
          return res
            .status(NOT_FOUND)
            .send({ message: `${email} not found.` });
        }
        return res.status(OK).send({
          message: `${email} was updated.`,
          emailOptIn: emailOptIn,
        });
      }
    );