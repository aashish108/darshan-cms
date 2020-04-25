const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  roles: { type: Array, required: true },
});

UserSchema.pre('save', (next) => {
  const user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, async (err1, salt) => {
    if (err1) return next(err1);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, async (err2, hash) => {
      if (err2) return next(err2);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
      return true;
    });
    return true;
  });
  return true;
});

UserSchema.methods.comparePassword = async (candidatePassword, cb) => {
  try {
    const passwordCompare = await bcrypt.compare(candidatePassword, this.password);
    return cb(null, passwordCompare);
  } catch (e) {
    console.log(e);
    return false;
  }
};

const Users = mongoose.model('User', UserSchema);

module.exports = { Users };
