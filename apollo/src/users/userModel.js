import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {
  createUserCollection,
  getDefaultCollections,
} from '../comments/collections/collectionService';

const {
  Types: { ObjectId },
} = mongoose;

const userOrgSchema = mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      index: true,
    },
    orgName: String,
    isActive: { type: Boolean, default: true },
    isAdmin: { type: Boolean, default: false },
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { _id: false, timestamps: true }
);

const repositoryScheme = mongoose.Schema(
  {
    id: String,
    name: String,
    fullName: String,
    githubUrl: String,
    isFavorite: { type: Boolean, default: false },
    previewImgLink: { type: String, default: '' },
  },
  { _id: false }
);

const identitySchema = mongoose.Schema(
  {
    provider: String,
    id: { type: String, required: true },
    username: String,
    email: String,
    emails: [],
    firstName: String,
    lastName: String,
    profileUrl: String,
    avatarUrl: String,
    repositories: [repositoryScheme],
    accessToken: String,
  },
  { _id: false }
);

const userSchema = mongoose.Schema(
  {
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
    inviteCount: { type: Number, default: 10 },
    isActive: { type: Boolean, default: true },
    // Legacy flag related to email/password signup.
    isVerified: { type: Boolean, default: true },
    isWaitlist: { type: Boolean, default: false },
    isFastForwardOnboarding: { type: Boolean, default: false },
    isOnboarded: { type: Date, default: null },
    banners: {
      organizationCreate: { type: Boolean, default: true },
    },
    verificationToken: String,
    verificationExpires: Date,
    resetToken: String,
    resetExpires: Date,
    handle: String,
    identities: [identitySchema],
    termsAccepted: { type: Boolean, default: false },
    termsAcceptedAt: { type: Date },
    lastLogin: { type: Date, default: null },
    origin: {
      type: String,
      enum: ['invitation', 'waitlist', 'signup', 'sync'],
    },
    isSemaAdmin: { type: Boolean, default: false },
    collections: [
      {
        collectionData: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Collection',
        },
        isActive: { type: Boolean, default: true },
      },
    ],
    companyName: String,
    cohort: String,
    notes: String,
    hasExtension: { type: Boolean, default: false },
    pinnedRepos: { type: [String], default: [] },
  },
  { timestamps: true }
);

const SALT_WORK_FACTOR = 10;

userSchema.pre('save', async function save(next) {
  if (!this.isModified('password')) return next();
  try {
    const { username } = this.identities[0];
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);

    // Creates default user collection
    if (this.isNew) {
      this._id = new ObjectId();
      const personalCollection = await createUserCollection(username, this._id);
      this.collections = await getDefaultCollections(personalCollection._id);
    }

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
  const {
    $set: { password },
  } = data;
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

// check if password is valid
userSchema.methods.validatePassword = async function validatePassword(data) {
  return bcrypt.compare(data, this.password);
};

userSchema.index({ 'username': 1, 'identities.id': 1 });
userSchema.index({ orgId: 1 });
userSchema.index(
  { 'identities.provider': 1, 'identities.id': 1 },
  {
    unique: true,
    partialFilterExpression: {
      'identities.provider': { $exists: true },
      'identities.id': { $exists: true },
    },
  }
);
// This index mostly serving Social Circles.
// If we ever update the SmartComment model to
// add references to MongoDB users, we can remove this index.
userSchema.index(
  { 'identities.provider': 1, 'identities.username': 1 },
  {
    unique: true,
    partialFilterExpression: {
      'identities.provider': { $exists: true },
      'identities.username': { $exists: true },
    },
  }
);

userSchema.statics.findOrCreateByIdentity =
  async function findOrCreateByIdentity({ provider, id }, attrs) {
    const existing = await this.findOne({
      identities: { $elemMatch: { provider, id } },
    });
    if (existing) return await updateDocument(existing, attrs);

    try {
      return await this.create(attrs);
    } catch (error) {
      const isDuplicateOnThisKey =
        error.code === 11000 &&
        Object.keys(error.keyPattern).sort().join(',') ===
          'identities.id,identities.provider';
      if (isDuplicateOnThisKey) {
        const other = await this.findOne({
          identities: { $elemMatch: { provider, id } },
        });
        return await updateDocument(other, attrs);
      }
      throw error;
    }
  };

async function updateDocument(doc, attrs) {
  try {
    doc.set(attrs);
    return await doc.save();
  } catch (error) {
    if (error.name !== 'VersionError') throw error;
    return doc;
  }
}

export default mongoose.model('User', userSchema);
