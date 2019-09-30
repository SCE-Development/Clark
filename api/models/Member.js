const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')

const MemberSchema = new Schema(
  {
    memberID: {
      type: String
    },
    firstName: {
      type: String,
      required: true
    },
    middleInitial: {
      type: String
    },
    lastName: {
      type: String,
      required: true
    },
    joinDate: {
      type: Date,
      default: Date.now
    },
    username: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    emailOptIn: {
      type: Boolean,
      default: true
    },
    major: {
      type: String
    },
    lastLogin: {
      type: Date,
      default: Date.now
    }
  },
  { collection: 'Member' }
)

MemberSchema.pre('save', function (next) {
  const member = this
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (error, salt) {
      if (error) {
        return next(error)
      }

      bcrypt.hash(member.password, salt, null, function (error, hash) {
        if (error) {
          return next(error)
        }

        member.password = hash
        next()
      })
    })
  } else {
    return next()
  }
})

MemberSchema.methods.comparePassword = function (passwd, callback) {
  bcrypt.compare(passwd, this.password, function (error, isMatch) {
    if (error) {
      return callback(error)
    }

    callback(null, isMatch)
  })
}

module.exports = mongoose.model('Member', MemberSchema)
