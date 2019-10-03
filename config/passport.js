const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const Member = require('../api/models/Member')
const config = require('../config/config')

module.exports = function (passport) {
  const options = {}
  options.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt')
  options.secretOrKey = config.secretKey

  passport.use(
    new JwtStrategy(options, function (jwtPayload, done) {
      Member.findOne({ id: jwtPayload.id }, function (error, user) {
        if (error) {
          return done(error, false)
        }

        if (user) {
          done(null, user)
        } else {
          done(null, false)
        }
      })
    })
  )
}
