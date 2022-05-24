import createUser from '../../../test/helpers/userHelper';
import SmartComment from './smartCommentModel';

describe('Smart Comment model', () => {
  let user;
  let smartComment;

  beforeAll(async () => {
    user = await createUser();
  });

  describe('legacy comment with comment ID like "r12345"', () => {
    beforeAll(async () => {
      await SmartComment.collection.insertOne({
        comment: 'These lines are very elegant',
        userId: user.id,
        location: 'files changed',
        suggestedComments: [],
        reaction: null,
        tags: [],
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

    describe('saving it', () => {
      beforeAll(async () => {
        smartComment = await SmartComment.findOne();
        await smartComment.save();
      });

      it('should migrate to comment ID format "discussion_r12345"', async () => {
        expect(smartComment.githubMetadata.commentId).toBe(
          'discussion_r872534677'
        );
      });
    });
  });
});
