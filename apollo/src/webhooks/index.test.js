import apollo from '../../test/apolloClient';
import { queue as githubWebhookQueue } from './githubWebhookQueue';

describe('POST /webhooks/github', () => {
  const testPayload = {
    action: 'created',
    issue: {},
    comment: {
      url: 'https://api.github.com/repos/testuser/test/issues/comments/123',
      html_url: 'https://github.com/testuser/test/issues/2#issuecomment-123',
      issue_url: 'https://api.github.com/repos/testuser/test/issues/2',
      id: 123,
      node_id: 'IC_kwDOHPP-uM5DuE_Z',
      user: {},
      created_at: '2022-05-24T16:39:10Z',
      updated_at: '2022-05-24T16:39:10Z',
      author_association: 'OWNER',
      body: 'asd',
      reactions: {
        'url':
          'https://api.github.com/repos/testuser/test/issues/comments/123/reactions',
        'total_count': 0,
        '+1': 0,
        '-1': 0,
        'laugh': 0,
        'hooray': 0,
        'confused': 0,
        'heart': 0,
        'rocket': 0,
        'eyes': 0,
      },
      performed_via_github_app: null,
    },
    repository: {},
    sender: {},
  };

  describe('Signature not match', () => {
    it('should return 500 Signature not match', async () => {
      await expect(async () => {
        await apollo.post('/v1/webhooks/github', testPayload, {
          headers: {
            'X-Hub-Signature-256':
              'sha256=2ddc1dae85823c1ffbd927929a73bbba3b10ba6fa241c4bf9c7b3982d39afca3123123',
            'X-GitHub-Event': 'pull_request_review_comment',
          },
        });
      }).rejects.toThrow(/500/);
    });
  });

  describe('Valid Signature', () => {
    it('should not queue job on invalid github Event', async () => {
      await expect(async () => {
        await apollo.post('/v1/webhooks/github', testPayload, {
          headers: {
            'X-Hub-Signature-256':
              'sha256=26a7f448c3dfb39eabc8f5f57b2650a49c7f849c7741090b5ad6b08915121539',
            'X-GitHub-Event': 'abc',
          },
        });
      }).rejects.toThrow(/500/);
    });

    it('should queue job on valid github Event', async () => {
      githubWebhookQueue.queueJob = jest.fn();
      githubWebhookQueue.queueJob.mockReturnValueOnce(1);
      const { status } = await apollo.post('/v1/webhooks/github', testPayload, {
        headers: {
          'X-Hub-Signature-256':
            'sha256=26a7f448c3dfb39eabc8f5f57b2650a49c7f849c7741090b5ad6b08915121539',
          'X-GitHub-Event': 'pull_request_review_comment',
        },
      });
      expect(status).toBe(200);
      expect(githubWebhookQueue.queueJob).toHaveBeenCalled();
    });
  });
});
