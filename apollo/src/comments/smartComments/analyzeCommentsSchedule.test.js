import mongoose from 'mongoose';
import createUser from '../../../test/helpers/userHelper';
import handler from './analyzeCommentsSchedule';
import { create as createRepository } from '../../repositories/repositoryService';
import SmartComment from './smartCommentModel';

const {
  Types: { ObjectId },
} = mongoose;

describe('Analyze Comments Schedule', () => {
  let user;
  let repository;

  beforeAll(async () => {
    user = await createUser();
  });

  beforeAll(async () => {
    repository = await createRepository({
      name: 'astrobee',
      owner: 'SemaSandbox',
      id: '391620249',
      type: 'github',
      userId: user._id,
      cloneUrl: 'https://github.com/SemaSandbox/astrobee',
    });
  });

  describe('comment from GitHub sync', () => {
    let comment;

    beforeAll(async () => {
      comment = await SmartComment.create({
        repositoryId: repository,
        userId: user,
        comment: 'Code looks awesome, also elegant',
        location: 'conversation',
        suggestedComments: [],
        tags: [],
        githubMetadata: {
          commentId: 'issuecomment-14049223',
          filename: null,
          repo: 'astrobee',
          repo_id: '391620249',
          url: 'https://github.com/SemaSandbox/astrobee',
          created_at: '2020-12-18T20:30:00Z',
          updated_at: '2020-12-17T20:30:14Z',
          user: {
            id: '1270524',
            login: 'jrock17',
          },
          requester: 'codykenb',
        },
        source: {
          origin: 'sync',
        },
      });
    });

    it('should not have analyzed at timestamp', () => {
      expect(comment.analyzedAt).toBeFalsy();
    });

    describe('on schedule', () => {
      beforeAll(async () => {
        await handler();
      });

      describe('comment', () => {
        beforeAll(async () => {
          comment = await SmartComment.findById(comment._id);
        });

        it('should have reaction', () => {
          expect(comment.reaction).toEqualID('607f0d1ed7f45b000ec2ed71');
        });

        it('should have tags', () => {
          expect(comment.tags).toHaveLength(1);
          expect(comment.tags[0]).toEqualID('607f0594ab1bc1aecbe2ce51');
        });

        it('should have analyzed at timestamp', () => {
          expect(comment.analyzedAt).toBeCloseToDate(new Date());
        });
      });

      describe('on new run', () => {
        let previousAnalyzedAt;

        beforeAll(async () => {
          // Blank reaction and tags and re-run scheduled job.
          // This is a way to ensure that the job is not picking
          // up comments that have been processed already.
          comment.reaction = SmartComment.schema.paths.reaction.default();
          comment.tags = [];
          await comment.save();
          previousAnalyzedAt = comment.analyzedAt;
        });

        beforeAll(async () => {
          await handler();
        });

        beforeAll(async () => {
          comment = await SmartComment.findById(comment._id);
        });

        it('should not query Jaxon', () => {
          expect(comment.reaction).toEqualID('607f0d1ed7f45b000ec2ed70');
          expect(comment.tags).toHaveLength(0);
        });

        it('should not change the analyzed at timestamp', () => {
          expect(comment.analyzedAt).toEqual(previousAnalyzedAt);
        });
      });
    });
  });

  describe('comment from Chrome extension', () => {
    let comment;

    beforeAll(async () => {
      await SmartComment.deleteMany();
    });

    beforeAll(async () => {
      comment = await SmartComment.create({
        repositoryId: repository,
        userId: user,
        comment: 'Code looks awesome, also elegant',
        location: 'conversation',
        suggestedComments: [],
        reaction: new ObjectId('607f0d1ed7f45b000ec2ed72'),
        tags: [new ObjectId('607f0594ab1bc1aecbe2ce4d')],
        githubMetadata: {
          commentId: 'issuecomment-14049223',
          filename: null,
          repo: 'astrobee',
          repo_id: '391620249',
          url: 'https://github.com/SemaSandbox/astrobee',
          created_at: '2020-12-18T20:30:00Z',
          updated_at: '2020-12-17T20:30:14Z',
          user: {
            id: '1270524',
            login: 'jrock17',
          },
          requester: 'codykenb',
        },
        source: {
          origin: 'extension',
        },
      });
    });

    it('should not have analyzed at timestamp', () => {
      expect(comment.analyzedAt).toBeFalsy();
    });

    describe('on schedule', () => {
      beforeAll(async () => {
        await handler();
      });

      describe('comment', () => {
        beforeAll(async () => {
          comment = await SmartComment.findById(comment._id);
        });

        it('should not change reaction', () => {
          expect(comment.reaction).toEqualID('607f0d1ed7f45b000ec2ed72');
        });

        it('should not change tags', () => {
          expect(comment.tags).toHaveLength(1);
          expect(comment.tags[0]).toEqualID('607f0594ab1bc1aecbe2ce4d');
        });

        it('should not have analyzed at timestamp', () => {
          expect(comment.analyzedAt).toBeFalsy();
        });
      });
    });
  });
});
