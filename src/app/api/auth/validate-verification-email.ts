// TODO

router.post('/validateVerificationEmail', async (req, res) => {
    User.findOne({ email: req.body.email }, async function(error, result) {
      if (error) {
        res.sendStatus(BAD_REQUEST);
      }
      if (!result) {
        res.sendStatus(NOT_FOUND);
      }
  
      bcrypt.compare(String(result._id), req.body.hashedId, async function(
        error,
        isMatch) {
        if (error) {
          res.sendStatus(BAD_REQUEST);
        }
        if (isMatch) {
          result.emailVerified = true;
          result.accessLevel = membershipState.NON_MEMBER;
          await result
            .save()
            .then(_ => {
              res.sendStatus(OK);
            })
            .catch(err => {
              res.sendStatus(BAD_REQUEST);
            });
        } else {
          res.sendStatus(BAD_REQUEST);
        }
      });
    });
  });