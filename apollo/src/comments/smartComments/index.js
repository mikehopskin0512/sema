import { Router } from 'express';
import { version } from '../../config';
import logger from '../../shared/logger';
import errors from '../../shared/errors';
import { findByExternalId } from '../../repositories/repositoryService';
import { create, getSmartComments } from './smartCommentService';

const route = Router();

export default (app, passport) => {
  app.use(`/${version}/comments/smart`, route);

  route.post('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const smartComment = req.body;
    try {
      const newSmartComment = await create(smartComment);
      if (!newSmartComment) {
        throw new errors.BadRequest('Smart Comment create error');
      }
      return res.status(201).json({ smartComment: newSmartComment });
    } catch (error) {
      logger(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/:repo', passport.authenticate(['basic'], { session: false }), async (req, res) => {
    const { repo } = req.params;
    try {
      const repository = await findByExternalId(repo);
      if (!repository) {
        return res.status(404).send({ message: 'Repository does not exist.' });
      }
      const smartComments = await getSmartComments({ repo });
      return res.status(201).send(smartComments);
    } catch (error) {
      logger(error);
      return res.status(error.statusCode).send(error);
    }
  });
};
