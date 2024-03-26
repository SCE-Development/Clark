// TODO

// User Login
router.post('/login', function(req, res) {
    if (!req.body.email || !req.body.password) {
      return res.sendStatus(BAD_REQUEST);
    }
  
    User.findOne(
      {
        email: req.body.email.toLowerCase()
      },
      function(error, user) {
        if (error) {
          return res.status(BAD_REQUEST).send({ message: 'Bad Request.' });
        }
  
        if (!user) {
          res
            .status(UNAUTHORIZED)
            .send({
              message: 'Username or password does not match our records.'
            });
        } else {
          // Check if password matches database
          user.comparePassword(req.body.password, function(error, isMatch) {
            if (isMatch && !error) {
              if (user.accessLevel === membershipState.BANNED) {
                return res
                  .status(UNAUTHORIZED)
                  .send({ message: 'User is banned.' });
              }
  
              // Check if the user's email has been verified
              if (!user.emailVerified) {
                return res
                  .status(UNAUTHORIZED)
                  .send({ message: 'Email has not been verified' });
              }
  
              // If the username and password matches the database, assign and
              // return a jwt token
              const jwtOptions = {
                expiresIn: '2h'
              };
  
              // check here to see if we should reset the pagecount. If so, do it
              if (checkIfPageCountResets(user.lastLogin)) {
                user.pagesPrinted = 0;
              }
  
              // Include fields from the User model that should
              // be passed to the JSON Web Token (JWT)
              const userToBeSigned = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                accessLevel: user.accessLevel,
                pagesPrinted: user.pagesPrinted,
                _id: user._id
              };
              user
                .save()
                .then(() => {
                  const token = jwt.sign(
                    userToBeSigned, config.secretKey, jwtOptions
                  );
                  res.json({ token: 'JWT ' + token });
                })
                .catch((error) => {
                  logger.error('unable to login user', error);
                  res.sendStatus(SERVER_ERROR);
                });
            } else {
              res.status(UNAUTHORIZED).send({
                message: 'Username or password does not match our records.'
              });
            }
          });
        }
      }
    );
  });