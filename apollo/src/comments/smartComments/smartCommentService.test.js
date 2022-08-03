import mongoose from 'mongoose';
import createUser from '../../../test/helpers/userHelper';
import { create as createRepository } from '../../repositories/repositoryService';
import { create as createSmartComment } from './smartCommentService';
import SmartComment from './smartCommentModel';
import Repository from '../../repositories/repositoryModel';
import User from '../../users/userModel';

const {
  Types: { ObjectId },
} = mongoose;

describe('Smart Comment Service', () => {
  let user;
  let smartComment;
  let repository;

  beforeAll(async () => {
    user = await createUser();
  });

  beforeAll(async () => {
    // Just adding entropy to ensure that
    // we update the right repository.
    await createRepository({
      name: 'astrobee',
      type: 'github',
      id: '391620249',
      cloneUrl: 'https://github.com/SemaSandbox/astrobee',
    });
  });

  describe('creating a smart comment on a new repository', () => {
    beforeAll(async () => {
      await createSmartComment({
        comment: 'These lines are very elegant',
        userId: user._id,
        location: 'files changed',
        suggestedComments: [],
        reaction: '607f0d1ed7f45b000ec2ed71',
        tags: ['607f0594ab1bc1aecbe2ce4d', '607f0594ab1bc1aecbe2ce4f'],
        githubMetadata: {
          commentId: 'r872534677',
          filename: 'apollo/src/app.js',
          line_numbers: [1, 2, 3],
          repo: 'phoenix',
          repo_id: '237888452',
          pull_number: 1713,
          url: 'https://github.com/Semalab/phoenix/pull/1713/files',
          base: 'develop',
          head: 'WEST-1421',
          created_at: '2020-12-17T18:41:44Z',
          updated_at: '2020-12-17T20:30:14Z',
          user: {
            id: '1270524',
            login: 'jrock17',
          },
          requester: 'codykenb',
        },
      });
    });

    beforeAll(async () => {
      repository = await Repository.findOne({ name: 'phoenix' });
      smartComment = await SmartComment.findOne();
      user = await User.findById(user._id);
    });

    describe('smart comment', () => {
      it('should have a reference to the repository', () => {
        expect(smartComment.repositoryId).toEqualID(repository);
      });
    });

    describe('user', () => {
      it('should have the repository in the identity', () => {
        const identity = user.identities[0];
        expect(identity.repositories[0].id).toBe('237888452');
        expect(identity.repositories[0].fullName).toBe('Semalab/phoenix');
      });
    });

    describe('repository', () => {
      it('should have name', () => {
        expect(repository.name).toBe('phoenix');
      });

      it('should have full name', () => {
        expect(repository.fullName).toBe('Semalab/phoenix');
      });

      it('should have clone URL', () => {
        expect(repository.cloneUrl).toBe('https://github.com/Semalab/phoenix');
      });

      it('should add a reference to the user', () => {
        expect(repository.repoStats.userIds.length).toBe(1);
        expect(repository.repoStats.userIds[0]).toEqualID(user._id);
      });

      it('should have comment count', () => {
        expect(repository.repoStats.smartComments).toBe(1);
      });

      it('should have review count', () => {
        expect(repository.repoStats.smartCodeReviews).toBe(1);
      });

      it('should have commenter count', () => {
        expect(repository.repoStats.smartCommenters).toBe(1);
      });

      it('should have Sema user count', () => {
        expect(repository.repoStats.semaUsers).toBe(1);
      });

      it('should add a reference to the reaction', () => {
        expect(repository.repoStats.reactions.length).toBe(1);
        expect(repository.repoStats.reactions[0].reactionId).toEqualID(
          '607f0d1ed7f45b000ec2ed71'
        );
      });

      it('should add a reference to the tags', () => {
        expect(repository.repoStats.tags.length).toBe(1);
        expect([...repository.repoStats.tags[0].tagsId]).toEqual([
          '607f0594ab1bc1aecbe2ce4d',
          '607f0594ab1bc1aecbe2ce4f',
        ]);
      });
    });

    describe('updating the reaction and tags', () => {
      beforeAll(async () => {
        smartComment.reaction = ObjectId('607f0d1ed7f45b000ec2ed70');
        smartComment.tags = [
          '607f0594ab1bc1aecbe2ce4f',
          '607f0594ab1bc1aecbe2ce51',
        ];
        await smartComment.save();
        repository = await Repository.findById(repository._id);
      });

      it('should not duplicate tags', () => {
        expect(repository.repoStats.tags.length).toBe(1);
        expect([...repository.repoStats.tags[0].tagsId]).toEqual([
          '607f0594ab1bc1aecbe2ce4f',
          '607f0594ab1bc1aecbe2ce51',
        ]);
      });

      it('should not duplicate reactions', () => {
        expect(repository.repoStats.reactions.length).toBe(1);
        expect(repository.repoStats.reactions[0].reactionId).toEqualID(
          '607f0d1ed7f45b000ec2ed70'
        );
      });
    });
  });
});
