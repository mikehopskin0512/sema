import mongoose from 'mongoose';
import User from './userModel';
import logger from '../shared/logger';
import errors from '../shared/errors';
import { generateToken } from '../shared/utils';

const { Types: { ObjectId } } = mongoose;

export const create = async (user) => {
  const {
    password = null, username, firstName, lastName,
    jobTitle = '', company = '', avatarUrl = '',
    identities, terms,
  } = user;

  // Verify token expires 24 hours from now
  const token = await generateToken();
  const now = new Date();
  const verificationExpires = now.setHours(now.getHours() + 24);

  try {
    const newUser = new User({
      username: username.toLowerCase(),
      password,
      firstName,
      lastName,
      jobTitle,
      company,
      avatarUrl,
      identities,
      verificationToken: token,
      verificationExpires,
      termsAccepted: terms,
      termsAcceptedAt: new Date(),
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
    const updatedUser = await query.exec();
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

export const findByUsername = async (username) => {
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

export const findById = async (id) => {
  try {
    const query = User.findOne({ _id: id });
    const user = await query.lean().exec();

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

export const validateLogin = async (username, password) => {
  const query = User.findOne({ username: username.toLowerCase() });
  const user = await query.select('+password').exec();

  if (!user) {
    throw new errors.NotFound('Username not found');
  }
  const validLogin = await user.validatePassword(password);

  if (!validLogin) {
    throw new errors.Unauthorized('Invalid username/password');
  }

  const payload = user.toObject();
  delete payload.password;

  return (payload);
};

export const initiatePasswordReset = async (username) => {
  // Token expires 12 hours from now
  const token = await generateToken();
  const now = new Date();
  const resetExpires = now.setHours(now.getHours() + 12);

  try {
    const query = User.findOneAndUpdate(
      { username },
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

export const resetVerification = async (username) => {
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
