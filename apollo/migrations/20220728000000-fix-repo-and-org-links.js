/* eslint-disable no-param-reassign */

require('../src/shared/mongo');

const { createUserRole } = require('../src/userRoles/userRoleService');
const { getRoleByName } = require('../src/roles/roleService');
const { default: Repository } = require('../src/repositories/repositoryModel');
const { withOctokit } = require('../src/repoSync/repoSyncService');
const Organization = require('../src/organizations/organizationModel');
const { default: User } = require('../src/users/userModel');
const { default: logger } = require('../src/shared/logger');

module.exports = {
  async up() {
    const repositoriesQuery = Repository.find({
      orgId: null,
    });
    const count = await Repository.countDocuments(repositoriesQuery);
    const progress = createProgress();
    progress.plan(count);

    await repositoriesQuery
      .cursor()
      .eachAsync(progress.wrap(migrateRepository), {
        parallel: 50,
        continueOnError: true,
      });
  },

  down() {
    return Promise.resolve();
  },
};

async function migrateRepository(repository) {
  try {
    const organization = await getOrganization(repository);

    if (!organization) return;

    const role = await getRoleByName('Member');

    repository.orgId = organization;
    await repository.save();
    organization.repos.addToSet(repository._id);
    await organization.save();

    await User.find({ _id: { $in: repository.repoStats.userIds } })
      .cursor()
      .eachAsync(
        async (user) => {
          await createUserRole({ user, organization, role });
        },
        { parallel: 50, continueOnError: true }
      );
  } catch (error) {
    if (error.status === 403)
      logger.info(
        `Cannot access repository ${repository.fullName} ${repository._id}`
      );
    else throw error;
  }
}

async function getOrganization(repository) {
  const { owner } = repository.getOwnerAndRepo();

  return await withOctokit(repository, async (octokit) => {
    try {
      const { data: org } = await octokit.orgs.get({
        org: owner,
      });

      if (!org || org.type !== 'Organization') return null;

      return await Organization.findOrCreate(
        {
          'orgMeta.id': org.id,
        },
        {
          name: org.login,
          avatarUrl: org.avatar_url,
          orgMeta: org,
        }
      );
    } catch (error) {
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
  });
}

function createProgress() {
  let processed = 0;
  let total = 0;
  let interval;

  const progress = {
    tick(count = 1) {
      processed += count;
    },
    plan(count) {
      total = count;
      logger.info(`Items to process: ${count}`);
      if (!interval) {
        interval = setInterval(() => {
          logger.info(`Progress: ${processed}/${total}`);
        }, 5000);
      }
    },
    wrap(fn) {
      return async (...args) => {
        try {
          await fn(...args);
        } finally {
          progress.tick();
        }
      };
    },
  };

  return progress;
}
