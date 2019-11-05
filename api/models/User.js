const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')

const UserSchema = new Schema(
  {
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

    // Users declared Major at SJSU
    major: {
      type: String
    },

    // Whether or not the user is an active member in SCE
    active: {
      type: Boolean,
      default: true
    },
    doorCode: {
      type: String
    },

    // The access level is defined as follows:
    // 0: Member
    // 1: Officer
    // 2: Admin
    accessLevel: {
      type: Number,
      default: 2
    },
    lastLogin: {
      type: Date,
      default: Date.now
    },
    membershipValidUntil: {
      type: Date,
      default: Date.now
    },
    pagesPrinted: {
      type: Number,
      default: 0
    }
  },
  { collection: 'User' }
)

UserSchema.pre('save', function (next) {
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

UserSchema.methods.comparePassword = function (passwd, callback) {
  bcrypt.compare(passwd, this.password, function (error, isMatch) {
    if (error) {
      return callback(error)
    }

    callback(null, isMatch)
  })
}

module.exports =
  mongoose.models && mongoose.models.User
    ? mongoose.models.User
    : mongoose.model('User', UserSchema)
