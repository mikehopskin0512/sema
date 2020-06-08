import { version } from '../../config';
import logger from '../shared/logger';
import errors from '../shared/errors';
import { create, update, findByUsername, findById } from './userService';

async function getUserDetails(req, res) {
  const { id } = req.params;

  try {
    const user = await findById(id);

    if (!user) {
      throw new errors.NotFound('No user found');
    }

    return res.status(201).send({
      user,
    });
  } catch (error) {
    logger.error(error);
    return res.status(error.statusCode).send(error);
  }
}

async function createUser(req, res) {
  const { ...user } = req.body;
  const { email } = user;

  try {
    const existingUser = await findByUsername(email);
    if (existingUser) { throw new errors.BadRequest('User already exisits'); }
  } catch (error) {
    logger.error(error);
    return res.status(error.statusCode).send(error);
  }

  try {
    const newUser = await create(user);
    if (!newUser) {
      throw new errors.BadRequest('User create error');
    }

    delete newUser.password;
    return res.status(201).send({
      user: newUser,
    });
  } catch (error) {
    logger.error(error);
    return res.status(error.statusCode).send(error);
  }
}

async function updateUser(req, res) {
  try {
    const user = await update(req.body.user);
    if (!user) {
      throw new errors.BadRequest('User update error');
    }

    delete user.password;
    return res.status(201).send({
      user,
    });
  } catch (error) {
    logger.error(error);
    return res.status(error.statusCode).send(error);
  }
}

function setup(app, passport) {
  app.get(`/${version}/users/:id`,
    passport.authenticate(['basic'], { session: false }),
    getUserDetails);
  app.post(`/${version}/users/`,
    passport.authenticate(['basic'], { session: false }),
    createUser);
  app.put(`/${version}/users/:id`,
    passport.authenticate(['basic', 'bearer'], { session: false }),
    updateUser);
}

module.exports = setup;
