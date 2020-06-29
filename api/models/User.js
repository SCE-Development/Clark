const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const membershipState = require('../constants').MEMBERSHIP_STATE;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true
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
    discordID: {
      type: String,
    },
    // Users declared Major at SJSU
    major: {
      type: String
    },

    doorCode: {
      type: String
    },

    accessLevel: {
      type: Number,
      default: membershipState.PENDING
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
);

UserSchema.pre('save', function(next) {
  const member = this;
  let emailRegExp = new RegExp (['^[a-zA-Z0-9.!#$%&\'*+\/=?^_`{|}~-]+@[a-zA-Z0',
    '-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61',
    '}[a-zA-Z0-9])?)*$'].join(''));
  if (!this.email.match(emailRegExp)) {
    return next('Bad email tried to be save (email format is: example@domain)');
  }
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function(error, salt) {
      if (error) {
        return next(error);
      }
      bcrypt.hash(member.password, salt, function(error, hash) {
        if (error) {
          return next(error);
        }

        member.password = hash;
        return next();
      });
    });
  } else {
    return next();
  }
});

UserSchema.methods.comparePassword = function(passwd, callback) {
  bcrypt.compare(passwd, this.password, function(error, isMatch) {
    if (error) {
      return callback(error);
    }

    callback(null, isMatch);
  });
};

module.exports =
  mongoose.models && mongoose.models.User
    ? mongoose.models.User
    : mongoose.model('User', UserSchema);
