const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RfidSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    // User's RFID card's indentifier a.k.a byte
    byte: {
      type: String,
      unique: true,
      required: true,
    },
    created: {
      type: Date,
      default: Date.now,
    },
    lastScanned : {
      type: Date,
      default: Date.now,
    }
  },
  { collection: 'RFID' }
);

RfidSchema.pre('save', function(next) {
  if (this.isModified('byte') || this.isNew) {
    bcrypt.genSalt(10, function(error, salt) {
      if (error) {
        return next(error);
      }
      bcrypt.hash(this.byte, salt, function(error, hash) {
        if (error) {
          return next(error);
        }
        this.byte = hash;
      });
    });
  }
  return next();
});

RfidSchema.methods.compareByte = function(byte, callback) {
  bcrypt.compare(byte, this.byte, function(error, isMatch) {
    if (error) {
      return callback(error);
    }

    callback(null, isMatch);
  });
};

module.exports = mongoose.model('RFID', RfidSchema);
