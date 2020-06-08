import express from 'express';
import { version } from '../../config';
import errors from '../shared/errors';

const { create, get } = require('./credentialService');

const credentialRouter = express.Router();

function getCredentials(req, res, next) {
  get(req.user._id, (err, payload) => {
    if (err) {
      return next(err);
    }

    if (!payload) {
      const error = new errors.NotFound('Credentials not found.');
      return res.status(error.statusCode).send(error);
    }

    return res.status(200).send({ credentials: payload });
  });
}

function createCredentials(req, res, next) {
  if (req.body.name) {
    create(req.user._id, req.body.name, (err, payload) => {
      let error;
      if (err) {
        if (err.code === 11000 || err.code === 11001) {
          error = new errors.UnprocessableEntity('Application name is already taken.');
          return res.status(error.statusCode).send(error);
        }

        return next(err);
      }

      if (!payload) {
        error = new errors.HTTPError('Credentials could not be saved.');
        return res.status(error.statusCode).send(error);
      }

      return res.status(201).send({ credentials: payload });
    });
  } else {
    const err = new errors.BadRequest('Application name must be specified in order to create api credentials.');
    res.status(err.statusCode).send(err);
  }
}

/*
function regenerateCredentials(req, res, next) {
  credentialService.regenerate(req.user._id, req.params.id, (err, payload) => {
    if (err) {
      return next(err);
    }

    if (!payload) {
      const error = new errors.HTTPError('Credentials could not be regenerated.');
      return res.status(error.statusCode).send(error);
    }

    return res.status(200).send({ credentials: payload });
  });
}
*/

function setup(app, passport) {
  credentialRouter.get('/', getCredentials);
  credentialRouter.post('/', createCredentials);
  // credentialRouter.put('/:id', regenerateCredentials);
  app.use(`/${version}/credentials`,
    passport.authenticate('bearer', { session: false }),
    credentialRouter);
}

module.exports = setup;
