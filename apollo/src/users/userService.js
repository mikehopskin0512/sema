import mongoose from 'mongoose';
import _ from 'lodash';
import User from './userModel';
import logger from '../shared/logger';
import errors from '../shared/errors';
import { generateToken, metricsStartDate } from '../shared/utils';
import { findById as findInviteById } from '../invitations/invitationService';
import UserRole from '../userRoles/userRoleModel';

const {
  Types: { ObjectId },
} = mongoose;

export const create = async (user, inviteToken) => {
  const {
    password = null,
    username = '',
    firstName,
    lastName,
    jobTitle = '',
    avatarUrl = '',
    identities,
    terms,
    collections,
  } = user;
  let { isWaitlist } = user;
  let { origin = 'waitlist' } = user;

  // Verify token expires 24 hours from now
  const token = await generateToken();
  const now = new Date();
  const verificationExpires = now.setHours(now.getHours() + 24);

  try {
    const invitation = await findInviteById(inviteToken);
    if (invitation) {
      isWaitlist = false;
      origin = 'invitation';
    }
    const provider = 'github';
    const githubIdentity = identities?.find(
      (item) => item?.provider === provider
    );
    const handle = githubIdentity?.username;
    const id = githubIdentity?.id;

    const newUser = await User.findOrCreateByIdentity(
      { provider, id },
      {
        username: username.toLowerCase(),
        password,
        firstName,
        lastName,
        jobTitle,
        avatarUrl,
        handle,
        identities,
        isWaitlist,
        origin,
        verificationToken: token,
        verificationExpires,
        termsAccepted: terms,
        termsAcceptedAt: new Date(),
        collections,
        isActive: true, // Activates ghost users.
      }
    );

    if (!!invitation && invitation.organization) {
      await UserRole.findOrCreate(
        {
          organization: invitation.organization,
          user: newUser._id,
        },
        {
          role: invitation.role,
        }
      );
    }

    return newUser;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const update = async (user) => {
  const { _id } = user;
  try {
    const query = User.findOneAndUpdate(
      { _id: new ObjectId(_id) },
      { $set: user },
      { new: true }
    );
    const updatedUser = await query
      .lean()
      .populate({
        path: 'collections.collectionData',
        model: 'Collection',
      })
      .exec();
    return updatedUser;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const patch = async (id, fields) => {
  try {
    const query = User.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: fields },
      { new: true }
    );
    const updatedUser = await query.lean().exec();
    return updatedUser;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const updateIdentity = async (user, identity) => {
  try {
    const userDocument = await User.findById(user._id);
    await userDocument.findOrCreateInArray(
      'identities',
      { provider: identity.provider },
      identity
    );
    return true;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const findByUsername = async (username = '') => {
  try {
    const query = User.findOne({ username: username.toLowerCase() });
    const user = await query.lean().exec();

    return user;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const findByUsernameOrIdentity = async (
  username = '',
  identity = {}
) => {
  try {
    const query = User.findOne({
      $or: [
        { username: username.toLowerCase() },
        {
          $and: [
            { 'identities.provider': identity.provider },
            { 'identities.id': identity.id },
          ],
        },
      ],
    });
    const user = await query.lean().exec();

    return user;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const findById = async (id) => {
  try {
    const query = User.findById(id);
    const user = await query
      .lean()
      .populate({
        path: 'collections.collectionData',
        model: 'Collection',
        select: {
          _id: 1,
          isActive: 1,
          name: 1,
        },
      })
      .exec();

    // If no user found, abort
    if (!user) return null;

    let roles = await UserRole.find({ user: id })
      .populate('organization')
      .populate('role');

    if (roles) {
      roles = roles.map((role) => role.toJSON());
    }

    return { ...user, roles };
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const findUserCollectionsByUserId = async (id) => {
  try {
    const query = User.findOne({ _id: id });
    // TODO: we have to delete that populate / it slows down /snippet page
    const user = await query
      .lean()
      .populate({
        path: 'collections.collectionData',
        model: 'Collection',
        select: {
          _id: 1,
          isActive: 1,
          name: 1,
          description: 1,
          author: 1,
          tags: 1,
          source: 1,
          type: 1,
        },
        populate: {
          path: 'comments',
          model: 'SuggestedComment',
          select: {
            source: 1,
          },
          populate: {
            path: 'tags.tag',
          },
        },
      })
      .exec();

    return user;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const findByOrgId = async (orgId) => {
  try {
    const query = User.find({ orgId });
    const users = await query.select('_id firstName lastName').lean().exec();

    return users;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const joinOrg = async (userId, org) => {
  const { id: orgId } = org;
  try {
    const query = User.findOneAndUpdate(
      { '_id': new ObjectId(userId), 'organizations.id': { $ne: orgId } },
      { $addToSet: { organizations: org } },
      { new: true }
    );

    const updatedUser = await query.exec();
    return updatedUser;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const validateLogin = async (username, password) => {
  const query = User.findOne({ username: username.toLowerCase() });
  const user = await query.select('+password').exec();

  if (!user) {
    throw new errors.NotFound('Username not found');
  }

  const { password: currentPassword } = user;

  if (currentPassword === null) {
    throw new errors.NotFound('No password set. Did you sign up via Github?');
  }

  const validLogin = await user.validatePassword(password);

  if (!validLogin) {
    throw new errors.Unauthorized('Invalid username/password');
  }

  const payload = user.toObject();
  delete payload.password;

  return payload;
};

export const initiatePasswordReset = async (username = '') => {
  // Token expires 12 hours from now
  const token = await generateToken();
  const now = new Date();
  const resetExpires = now.setHours(now.getHours() + 12);

  try {
    const query = User.findOneAndUpdate(
      { username: username.toLowerCase() },
      { $set: { resetToken: token, resetExpires } },
      { new: true }
    );
    const updatedUser = await query.lean().exec();

    if (!updatedUser) {
      throw new errors.NotFound('Username not found');
    }
    return updatedUser;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const verifyUser = async (verificationToken) => {
  try {
    // Must find and update in 2-steps since we always have to return user
    const query = User.findOne({ verificationToken });
    const user = await query.exec();

    if (!user) {
      throw new errors.NotFound('User not found');
    }

    const { verificationExpires } = user;
    if (verificationExpires > Date.now()) {
      user.isVerified = true;
      user.verificationToken = null;
      user.verificationExpires = null;
    }

    const updatedUser = await user.save();
    return updatedUser;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const resetVerification = async (username = '') => {
  // Verify token expires 24 hours from now
  const token = await generateToken();
  const now = new Date();
  const verificationExpires = now.setHours(now.getHours() + 24);

  try {
    const query = User.findOneAndUpdate(
      { username: username.toLowerCase() },
      {
        $set: {
          isVerified: false,
          verificationToken: token,
          verificationExpires,
        },
      },
      { new: true }
    );
    const updatedUser = await query.lean().exec();

    if (!updatedUser) {
      throw new errors.NotFound('User not found');
    }

    return updatedUser;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const resetPassword = async (token, password) => {
  try {
    const query = User.findOneAndUpdate(
      {
        resetToken: token,
        resetExpires: {
          $gt: Date.now(),
        },
      },
      {
        $set: {
          password,
          resetToken: null,
          resetExpires: null,
        },
      },
      { new: true }
    );
    const updatedUser = await query.lean().exec();

    if (!updatedUser) {
      throw new errors.NotFound('Invalid or expired token');
    }
    return updatedUser;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const validatePasswordReset = async (token) => {
  try {
    const query = User.findOne({
      resetToken: token,
      resetExpires: {
        $gt: Date.now(),
      },
    });
    const user = await query.lean().exec();

    if (!user) {
      throw new errors.BadRequest('Invalid or expired token');
    }
    return user;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const updateLastLogin = async (user) => {
  try {
    const { _id } = user;
    const query = User.findOneAndUpdate(
      { _id: new ObjectId(_id) },
      { lastLogin: Date.now() }
    );
    await query.exec();
    return true;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const updateUserRepositoryList = async (user, repos, identity) => {
  try {
    const identityRepo = user.identities?.[0].repositories || [];

    const repositories = repos.map((el) => {
      const { name, id, full_name: fullName, html_url: githubUrl } = el;
      const index = _.findIndex(
        identityRepo,
        (o) => o.id.toString() === el.id.toString()
      );
      if (index === -1) {
        return { name, id, fullName, githubUrl };
      }
      const repo = identityRepo[index];
      return { name, id, fullName, githubUrl, ...repo };
    });
    const newIdentity = Object.assign(identity, { repositories });
    await updateIdentity(user, newIdentity);
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const updatePreviewImgLink = async (userId, repoId, imgUrl) => {
  try {
    const user = await findById(userId);
    const identityRepos = user.identities[0].repositories || [];
    const updatedRepo = identityRepos.find((repo) => repo.id === repoId);
    updatedRepo.previewImgLink = imgUrl;
    const newIdentity = Object.assign(user.identities[0], {
      repositories: identityRepos,
    });
    await updateIdentity(user, newIdentity);
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const addRepositoryToIdentity = async (user, repository) => {
  try {
    const id = repository.externalId;

    // This MongoDB query ensures that we don't add the same
    // repository twice under concurrency.
    await User.updateOne(
      {
        _id: user._id,
        identities: {
          $elemMatch: {
            provider: 'github',
            repositories: {
              $not: { $elemMatch: { id } },
            },
          },
        },
      },
      {
        $addToSet: {
          'identities.$.repositories': {
            id,
            name: repository.name,
            fullName: repository.fullName,
            githubUrl: repository.cloneUrl,
          },
        },
      }
    );
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(err);
    throw error;
  }
};

export const revokeInvitation = async (senderEmail) => {
  try {
    await User.findOneAndUpdate(
      { username: senderEmail },
      { $inc: { inviteCount: 1 } }
    );
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const bulkUpdateUserCollections = async (doc, ids) => {
  try {
    const filter = ids
      ? {
          _id: { $in: ids },
        }
      : {};
    await User.updateMany(filter, {
      $push: {
        collections: {
          isActive: false,
          collectionData: doc,
        },
      },
    });
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const getUserMetadata = async (id) => {
  const user = await User.findById(id)
    .select({ firstName: 1, lastName: 1, avatarUrl: 1, identities: 1 })
    .lean()
    .exec();
  return user;
};

export async function getRepoUsersMetrics(repoExternalId) {
  const [doc] = await User.aggregate([
    {
      $match: {
        'createdAt': {
          $gte: metricsStartDate,
        },
        'identities.repositories.id': repoExternalId,
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$createdAt',
          },
        },
        users: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: '$$REMOVE',
        values: {
          $arrayToObject: [
            [
              {
                k: '$_id',
                v: '$users',
              },
            ],
          ],
        },
      },
    },
    {
      $group: {
        _id: null,
        values: {
          $mergeObjects: '$values',
        },
      },
    },
    {
      $replaceRoot: {
        newRoot: '$values',
      },
    },
  ]);
  return doc;
}

export async function getOrganizationUsersMetrics(organizationId) {
  const [doc] = await User.aggregate([
    {
      $match: {
        createdAt: {
          $gte: metricsStartDate,
        },
      },
    },
    {
      $lookup: {
        from: 'userroles',
        localField: '_id',
        foreignField: 'user',
        as: 'userRole',
      },
    },
    {
      $unwind: '$userRole',
    },
    {
      $match: {
        'userRole.organization': new ObjectId(organizationId),
      },
    },
    {
      $lookup: {
        from: 'organizations',
        localField: 'userRole.organization',
        foreignField: '_id',
        as: 'organization',
      },
    },
    {
      $unwind: '$organization',
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$createdAt',
          },
        },
        users: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: '$$REMOVE',
        values: {
          $arrayToObject: [
            [
              {
                k: '$_id',
                v: '$users',
              },
            ],
          ],
        },
      },
    },
    {
      $group: {
        _id: null,
        values: {
          $mergeObjects: '$values',
        },
      },
    },
    {
      $replaceRoot: {
        newRoot: '$values',
      },
    },
  ]);
  return doc;
}

export const findUsersByGitHubHandle = async (handles) => {
  try {
    return User.find({
      'identities.provider': 'github',
      'identities.username': { $in: handles },
    })
      .select({ 'identities.repositories': 0, 'collections': 0 })
      .lean()
      .exec();
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const findByHandle = async (handle) => {
  try {
    const query = User.findOne({ handle });
    const user = await query.lean().exec();

    return user;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const createGhostUser = async (attributes) => {
  const provider = 'github';
  const githubIdentity = attributes.identities?.find(
    (item) => item?.provider === provider
  );
  const id = githubIdentity?.id;
  return await User.findOrCreateByIdentity(
    { provider, id },
    {
      ...attributes,
      isActive: false,
      origin: 'sync',
    }
  );
};

export const toggleUserRepoPinned = async (userId, repoId) => {
  await User.updateOne({ _id: userId }, [
    {
      $set: {
        pinnedRepos: {
          $cond: [
            { $ifNull: ['$pinnedRepos', false] },
            {
              $cond: [
                { $in: [repoId, '$pinnedRepos'] },
                { $setDifference: ['$pinnedRepos', [repoId]] },
                { $concatArrays: ['$pinnedRepos', [repoId]] },
              ],
            },
            [repoId],
          ],
        },
      },
    },
  ]);

  return true;
};

export const forceVerifyUser = async (user) => {
  if (user.isVerified) return;

  await User.updateOne({ _id: user._id }, { isVerified: true });
};
