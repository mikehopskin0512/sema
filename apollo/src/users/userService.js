import mongoose from 'mongoose';
import User from './userModel';
import logger from '../shared/logger';
import errors from '../shared/errors';

const { Types: { ObjectId } } = mongoose;

const create = async (user) => {
  const {
    password, email, firstName, lastName,
    jobTitle = '', company = '',
  } = user;

  try {
    const newUser = new User({
      username: email.toLowerCase(),
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

const update = async (user) => {
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

const findByUsername = async (username) => {
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

const findById = async (id) => {
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

export {
  create,
  update,
  findByUsername,
  findById,
};
