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
    const { username: handle } =
      identities.length &&
      identities.find((item) => item?.provider === 'github');

    const newUser = new User({
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
    });
    const savedUser = await newUser.save();

    if (!!invitation && invitation.team) {
      await UserRole.create({
        team: invitation.team,
        user: savedUser._id,
        role: invitation.role,
      });
    }

    return savedUser;
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
  const { _id } = user;
  const { provider } = identity;

  try {
    // In order to handle both insert and update
    // need to pull old identity and then push new one
    const queryPull = User.updateOne(
      { _id: new ObjectId(_id) },
      { $pull: { identities: { provider } } }
    );

    const queryAdd = User.updateOne(
      { _id: new ObjectId(_id) },
      { $addToSet: { identities: identity } }
    );

    await queryPull.exec();
    await queryAdd.exec();
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
      .populate('team')
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

export const addRepositoryToIdentity = async (user, repository) => {
  try {
    const identityRepo = user.identities?.[0].repositories || [];
    if (_.findIndex(identityRepo, { id: repository.id }) !== -1) {
      return true;
    }
    let identity = user.identities?.[0];
    identity = Object.assign(identity, {
      repositories: [...identityRepo, repository],
    });
    await updateIdentity(user, identity);
    return true;
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

export async function getTeamUsersMetrics(teamId) {
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
        'userRole.team': new ObjectId(teamId),
      },
    },
    {
      $lookup: {
        from: 'teams',
        localField: 'userRole.team',
        foreignField: '_id',
        as: 'team',
      },
    },
    {
      $unwind: '$team',
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

export const findByHandle = async (handle) => {
  try {
    const query = User.findOne({ handle: handle.toLowerCase() });
    const user = await query.lean().exec();

    return user;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};
