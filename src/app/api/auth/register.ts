// TODO 

// Register a member
router.post('/register', async (req, res) => {
    const registrationStatus = await registerUser(req.body);
    if (!registrationStatus.userSaved) {
      if (registrationStatus.status === 'BAD_REQUEST') {
        return res.status(BAD_REQUEST).send({
          message: registrationStatus.message
        });
      } else {
        res.status(CONFLICT).send({ message: registrationStatus.message });
      }
    } else {
      const name = req.body.firstName + ' ' + req.body.lastName;
      sendVerificationEmail(name, req.body.email);
      res.sendStatus(OK);
    }
  });