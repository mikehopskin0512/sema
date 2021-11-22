import mongoose from 'mongoose';
import _ from 'lodash';
import User from './userModel';
import Invitation from '../invitations/invitationModel';
import logger from '../shared/logger';
import errors from '../shared/errors';
import { generateToken } from '../shared/utils';
import { checkIfInvited } from '../invitations/invitationService';
import UserRole from '../roles/userRoleModel';

const { Types: { ObjectId } } = mongoose;

export const create = async (user) => {
  let {
    password = null, username = '', firstName, lastName,
    jobTitle = '', avatarUrl = '',
    identities, terms,
    isWaitlist, origin,
    collections,
  } = user;

  // Verify token expires 24 hours from now
  const token = await generateToken();
  const now = new Date();
  const verificationExpires = now.setHours(now.getHours() + 24);

  try {
    const invitation = await checkIfInvited(username);
    if(!!invitation.length) {
      isWaitlist = false;
    }

    const newUser = new User({
      username: username.toLowerCase(),
      password,
      firstName,
      lastName,
      jobTitle,
      avatarUrl,
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
    return savedUser;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
};

export const update = async (user) => {
  const { _id } = user;
  try {
    const query = User.findOneAndUpdate(
      { _id: new ObjectId(_id) },
      { $set: user },
      { new: true },
    );
    const updatedUser = await query.lean().populate({
      path: 'collections.collectionData',
      model: 'Collection',
    }).exec();
    return updatedUser;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
};

export const patch = async (id, fields) => {
  try {
    const query = User.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: fields },
      { new: true },
    );
    const updatedUser = await query.lean().exec();
    return updatedUser;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
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
      { $pull: { identities: { provider } } },
    );

    const queryAdd = User.updateOne(
      { _id: new ObjectId(_id) },
      { $addToSet: { identities: identity } },
    );

    await queryPull.exec();
    await queryAdd.exec();
    return true;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
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

export const findByUsernameOrIdentity = async (username = '', identity = {}) => {
  try {
    const query = User.findOne({
      $or:
        [
          { username: username.toLowerCase() },
          {
            $and: [
              { 'identities.provider': identity.provider },
              { 'identities.id': identity.id },
            ]
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
    const user = await query.lean().populate({
      path: 'collections.collectionData',
      model: 'Collection',
      select: {
        _id: 1,
        isActive: 1,
        name: 1,
      }
    }).exec();

    // If no user found, abort
    if (!user) {
      return {};
    }

    let roles = await UserRole.find({ user: id })
    .populate('team')
    .populate('role');

    if (roles) {
      roles = roles.map((role) => (role.toJSON()));
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
    const user = await query.lean().populate({
      path: 'collections.collectionData',
      model: 'Collection',
      select: {
        _id: 1,
        isActive: 1,
        name: 1,
        description: 1,
        author: 1,
        tags: 1,
      },
      populate: {
        path: 'comments',
        model: 'SuggestedComment',
        select: {
          source: 1,
        },
        populate: {
          path: 'tags.tag'
        }
      }
    }).exec();

    return user;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
}

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
      { _id: new ObjectId(userId), 'orgaizations.id': { $ne: orgId } },
      { $addToSet: { organizations: org } },
      { new: true },
    );

    const updatedUser = await query.exec();
    return updatedUser;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
};

export const validateLogin = async (username = '', password) => {
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

  return (payload);
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
      { new: true },
    );
    const updatedUser = await query.lean().exec();

    if (!updatedUser) {
      throw new errors.NotFound('Username not found');
    }
    return updatedUser;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
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
    throw (error);
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
        $set:
        {
          isVerified: false,
          verificationToken: token,
          verificationExpires,
        },
      },
      { new: true },
    );
    const updatedUser = await query.lean().exec();

    if (!updatedUser) {
      throw new errors.NotFound('User not found');
    }

    return updatedUser;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
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
        $set:
        {
          password,
          resetToken: null,
          resetExpires: null,
        },
      },
      { new: true },
    );
    const updatedUser = await query.lean().exec();

    if (!updatedUser) {
      throw new errors.NotFound('Invalid or expired token');
    }
    return updatedUser;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
};

export const validatePasswordReset = async (token) => {
  try {
    const query = User.findOne(
      {
        resetToken: token,
        resetExpires: {
          $gt: Date.now(),
        },
      },
    );
    const user = await query.lean().exec();

    if (!user) {
      throw new errors.BadRequest('Invalid or expired token');
    }
    return user;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
};

export const updateLastLogin = async (user) => {
  try {
    const { _id } = user;
    const query = User.findOneAndUpdate(
      { _id: new ObjectId(_id) },
      { lastLogin: Date.now() },
    );
    await query.exec();
    return true;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
};

export const updateUserRepositoryList = async (user, repos, identity) => {
  try {
    const identityRepo = user.identities?.[0].repositories;

    const repositories = repos.map((el) => {
      const { name, id, full_name: fullName, html_url: githubUrl } = el;
      const index = _.findIndex(identityRepo, function(o) {
        return o.id.toString() === el.id.toString();
      } );
      if (index === -1) {
        return { name, id, fullName, githubUrl };
      }
      const repo = identityRepo[index];
      return { name, id, fullName, githubUrl, ...repo };
    });
    identity = Object.assign(identity, { repositories });
    await updateIdentity(user, identity);
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
};

export const addRepositoryToIdentity = async (user, repository) => {
  try {
    const identityRepo = user.identities?.[0].repositories;
    if (_.findIndex(identityRepo, { 'id': repository.id }) !== -1) {
      return true;
    }
    let identity = user.identities?.[0];
    identity = Object.assign(identity, { repositories: [ ...identityRepo, repository ] });
    await updateIdentity(user, identity);
    return true;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
};

export const revokeInvitation = async (senderEmail) => {
  try {
    await User.findOneAndUpdate({ username: senderEmail }, { $inc: { inviteCount: 1 }});
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
};

export const bulkUpdateUserCollections = async (doc, ids) => {
  try {
    const filter = ids ? {
      _id: { $in: ids }
    } : {};
    await User.updateMany(
      filter,
      {
        $push: {
          "collections": {
            isActive: false,
            collectionData: doc
          }
        }
      }
    )
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
}

// populate collections to multiple users
export const populateCollectionsToUsers = async (collectionIds = [], userId = null) => {
  try {
    if (userId) {
      const user = await User.findById(userId).select('collections');
      await populateCollections(collectionIds, user);
    } else {
      const users = await User.find({ isActive: true }).select('collections');
      await Promise.all(users.map(async (user) => await populateCollections(collectionIds, user)));
    }
  } catch (e) {
    logger.error(e);
    throw (error);
  }
};

// populate collections to a single user
export const populateCollections = async (collectionIds = [], user) => {
  try {
    if (user && user.collections) {
      const existingCollectionIds = user.collections.map(col => col.collectionData);
      const newCollectionIds = collectionIds.filter(collectionId => existingCollectionIds.indexOf(collectionId) < 0);
      await User.updateOne({ _id: user._id }, {
        $push: {
          collections: {
            $each: newCollectionIds.map(id => ({ isActive: false, collectionData: id }))
          }
        }
      });
    }
  } catch (err) {
    logger.error(err);
    throw (error);
  }
}
