import * as userService from '../users/userService';
import { create as createRepository } from '../repositories/repositoryService';
import handler from './githubWebhookQueue';
import SmartComment from '../comments/smartComments/smartCommentModel';

describe('Github Webhook Queue', () => {
  it('should create smart comments on queue', async () => {
    const user = await userService.create({
      username: 'Ada',
      password: 's3cr3t',
      firstName: 'Ada',
      lastName: 'Lovelace',
      identities: [
        {
          id: 1045023,
          email: 'pangeaware@example.com',
          provider: 'github',
          repositories: [],
        },
      ],
      terms: true,
    });

    const repository = await createRepository({
      name: 'phoenix',
      type: 'github',
      id: '237888452',
      installationId: '25676597',
      addedBy: user,
      cloneUrl: 'https://github.com/Semalab/phoenix',
    });

    const payload = {
      comment: {
        url: 'https://api.github.com/repos/Semalab/phoenix/pulls/comments/545313646',
        pull_request_review_id: 554880620,
        id: 545313646,
        node_id: 'MDI0OlB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudDU0NTMxMzY0Ng==',
        commit_id: '7db0665a4c0f7e496d96920f1fe0db207bb4437c',
        original_commit_id: '43d87631f9550c05ef2786513d76b4ba49c6aadb',
        user: {
          login: 'pangeaware',
          id: 1045023,
          type: 'User',
        },
        body: '@jrock17 this function feels like it should live somewhere else as well with repo code.',
        created_at: '2020-12-17T18:35:40Z',
        updated_at: '2020-12-17T20:30:14Z',
        pull_request_url:
          'https://api.github.com/repos/Semalab/phoenix/pulls/3',
      },
      repository: {
        id: '237888452',
      },
      pull_request: {
        user: {
          login: 'ada',
        },
        base: {
          repo: {
            name: 'phoenix',
            id: '237888452',
            html_url: 'https://github.com/Semalab/phoenix',
          },
        },
      },
    };
    await handler(payload);
    let comments = await SmartComment.find({
      'githubMetadata.repo_id': repository.externalId,
    });
    expect(comments.length).toBe(1);
  });
});
