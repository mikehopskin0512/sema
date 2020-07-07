import mongoose from 'mongoose';
import User from './userModel';
import logger from '../shared/logger';
import errors from '../shared/errors';

const { Types: { ObjectId } } = mongoose;

export const create = async (user) => {
  const {
    password, username, firstName, lastName,
    jobTitle = '', company = '',
  } = user;

  try {
    const newUser = new User({
      username: username.toLowerCase(),
      password,
      firstName,
      lastName,
      jobTitle,
      company,
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
