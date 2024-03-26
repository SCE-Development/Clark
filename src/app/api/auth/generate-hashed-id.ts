// TODO

router.post('/generateHashedId', async (req, res) => {
    User.findOne({ email: req.body.email }, function(error, result) {
      if (error) {
        return res.sendStatus(BAD_REQUEST);
      }
      if (!result) {
        return res.sendStatus(NOT_FOUND);
      }
      let hashedId = String(result._id);
      // Generate a salt and created a hashed value of the _id using
      // bcrypts library
      bcrypt.genSalt(10, function(error, salt) {
        if (error) {
          // reject('Bcrypt failed')
          res.sendStatus(BAD_REQUEST);
        }
  
        bcrypt.hash(hashedId, salt, function(error, hash) {
          if (error) {
            res.sendStatus(BAD_REQUEST);
          }
          hashedId = hash;
          res.status(OK).send({ hashedId });
        });
      });
    });
  });