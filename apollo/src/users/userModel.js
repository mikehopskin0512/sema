import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import logger from '../shared/logger';

const userSchema = mongoose.Schema({
  username: String,
  password: {
    type: String,
    select: false,
  },
  firstName: String,
  lastName: String,
  jobTitle: String,
  company: String,
});

const SALT_WORK_FACTOR = 10;

userSchema.pre('save', async function save(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.generateHash = (password) => {
  // Might not need this due to above
  // return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) {
      logger.error(err);
      return err;
    }

    bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        logger.error(err);
        return err;
      }

      // Store hash in your password DB.
      return hash;
    });

    return false;
  });
};

// check if password is valid
userSchema.methods.comparePassword = (candidatePassword, cb) => {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
      logger.error(err);
      return cb(err);
    }
    return cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);
