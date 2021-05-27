import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import logger from '../shared/logger';

const userOrgSchema = mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', index: true },
  orgName: String,
  isActive: { type: Boolean, default: true },
  isAdmin: { type: Boolean, default: false },
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { _id: false, timestamps: true });

const identitySchema = mongoose.Schema({
  provider: String,
  id: String,
  username: String,
  email: String,
  firstName: String,
  lastName: String,
  profileUrl: String,
  avatarUrl: String,
}, { _id: false });

const userSchema = mongoose.Schema({
  username: String,
  password: {
    type: String,
    select: false,
  },
  firstName: String,
  lastName: String,
  organizations: [userOrgSchema],
  jobTitle: String,
  company: String,
  avatarUrl: String,
  inviteCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  isWaitlist: { type: Boolean, default: false },
  verificationToken: String,
  verificationExpires: Date,
  resetToken: String,
  resetExpires: Date,
  identities: [identitySchema],
  termsAccepted: { type: Boolean, default: false },
  termsAcceptedAt: { type: Date },
  lastLogin: { type: Date, default: null },
  isSemaAdmin: { type: Boolean, default: false },
  origin: { type: String, enum: ['invitation', 'waitlist', 'signup'], default: 'signup' },
}, { timestamps: true });

const SALT_WORK_FACTOR = 10;

userSchema.pre('save', async function save(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    // Allow null password (don't hash if password is null)
    if (this.password) {
      this.password = await bcrypt.hash(this.password, salt);
    }
    return next();
  } catch (err) {
    return next(err);
  }
});

// For update pre hook, isModified won't work. Need to get data first and use this.set.
userSchema.pre('findOneAndUpdate', async function findOneAndUpdate(next) {
  const data = this.getUpdate();
  const { $set: { password } } = data;
  if (!password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hashedPassword = await bcrypt.hash(password, salt);
    this.set({ password: hashedPassword });
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
userSchema.methods.validatePassword = async function validatePassword(data) {
  return bcrypt.compare(data, this.password);
};

userSchema.index({ username: 1, 'identities.id': 1 });
userSchema.index({ orgId: 1 });

module.exports = mongoose.model('User', userSchema);
