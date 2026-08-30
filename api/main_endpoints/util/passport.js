const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');
const { secretKey } = require('../../config/config.json');

const cookieOrHeaderExtractor = function(req) {
  if (req && req.cookies && req.cookies.jwtToken) {
    return req.cookies.jwtToken;
  }
  return ExtractJwt.fromAuthHeaderWithScheme('jwt')(req);
};

module.exports = function(passport) {
  const options = {};
  options.jwtFromRequest = cookieOrHeaderExtractor;
  options.secretOrKey = secretKey;

  passport.use(
    new JwtStrategy(options, function(jwtPayload, done) {
      User.findOne({ id: jwtPayload.id }, function(error, user) {
        if (error) {
          return done(error, false);
        }

        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      });
    })
  );
};
