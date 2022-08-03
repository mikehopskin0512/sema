import nock from 'nock';
import { create as createRepository } from '../repositories/repositoryService';
import { queue as pollRepositoryQueue } from './pollRepositoryQueue';
import handler from './pollRepositoriesSchedule';
import createUser from '../../test/helpers/userHelper';

describe('Poll Repositories Schedule', () => {
  let user;

  beforeAll(async () => {
    user = await createUser();
  });

  let phoenix;
  let astrobee;
  let manim;

  beforeAll(async () => {
    // Phoenix is completed but authenticated so we get webhooks.
    phoenix = await createRepository({
      name: 'phoenix',
      owner: 'Semalab',
      id: '237888452',
      type: 'github',
      userId: user._id,
      cloneUrl: 'https://github.com/Semalab/phoenix',
    });

    await phoenix.updateOne({ 'sync.status': 'completed' });
    nock('https://api.github.com')
      .persist()
      .get(`/repos/Semalab/phoenix/installation`)
      .reply(200, {
        id: '25676597',
      });

    // Astrobee is completed and not authenticated so we don't get webhooks.
    astrobee = await createRepository({
      id: '391620249',
      type: 'github',
      name: 'astrobee',
      owner: 'SemaSandbox',
      userId: user._id,
      cloneUrl: 'https://github.com/SemaSandbox/astrobee',
    });

    await astrobee.updateOne({ 'sync.status': 'completed' });

    nock('https://api.github.com')
      .persist()
      .get(`/repos/SemaSandbox/astrobee/installation`)
      .reply(404, {});

    // Manim is not synced
    manim = await createRepository({
      type: 'github',
      id: '415029011',
      name: 'manim',
      owner: 'SemaSandbox',
      userId: user._id,
      cloneUrl: 'https://github.com/SemaSandbox/manim',
    });
  });

  describe('on schedule', () => {
    beforeAll(async () => {
      await handler();
    });

    it('should not queue Semalab/phoenix for update', () => {
      const ids = pollRepositoryQueue.jobs.map((job) => job.id);
      expect(ids).not.toContain(phoenix._id.toString());
    });

    it('should not queue SemaSandbox/manim for update', () => {
      const ids = pollRepositoryQueue.jobs.map((job) => job.id);
      expect(ids).not.toContain(manim._id.toString());
    });

    it('should queue SemaSandbox/astrobee for update', () => {
      const ids = pollRepositoryQueue.jobs.map((job) => job.id);
      expect(ids).toContain(astrobee._id.toString());
    });
  });
});
