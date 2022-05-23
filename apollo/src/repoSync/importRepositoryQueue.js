import { createAppAuth } from '@octokit/auth-app';
import { differenceInMinutes } from 'date-fns';
import { Octokit } from '@octokit/rest';
import Cache from 'caching-map';
import logger from '../shared/logger';
import { queues } from '../queues';
import { github } from '../config';
import Repository from '../repositories/repositoryModel';
import SmartComment from '../comments/smartComments/smartCommentModel';
import * as jaxon from '../shared/apiJaxon';
import { findOneByTitle as findReactionByTitle } from '../comments/reaction/reactionService';
import { findOneByLabel as findTagByLabel } from '../comments/tags/tagService';

const queue = queues.self(module);

export default async function importRepository({ id }) {
  logger.info(`Repo sync: ${queue.name} processing repository ${id}`);

  const repository = await Repository.findById(id);

  const isRepoSyncSupported = repository.type === 'github';
  if (!isRepoSyncSupported) {
    logger.error(
      `Repo sync: Skipping repo sync for repository ${id}, type is ${repository.type}`
    );
    return;
  }

  await setSyncStarted(repository);

  const octokit = await getOctokit(repository);
  const importComment = createGitHubImporter(octokit);

  await Promise.all([
    importComments({
      octokit,
      type: 'pullRequestComment',
      endpoint: `/repos/{owner}/{repo}/pulls/comments`,
      repository,
      importComment,
    }),
    importComments({
      octokit,
      type: 'issueComment',
      endpoint: `/repos/{owner}/{repo}/issues/comments`,
      repository,
      importComment,
    }),
    importReviews({
      octokit,
      endpoint: `/repos/{owner}/{repo}/pulls`,
      repository,
      importComment,
    }),
  ]);

  await setSyncCompleted(repository);
}

// Imports pull request and issue comments.
// https://docs.github.com/en/rest/pulls/comments#get-a-review-comment-for-a-pull-request
// https://docs.github.com/en/rest/issues/comments#get-an-issue-comment
async function importComments({
  octokit,
  endpoint,
  type,
  repository,
  importComment,
}) {
  const pages = resumablePaginate({ octokit, endpoint, type, repository });
  for await (const data of pages) {
    await Promise.all(data.map(importComment));
  }
}

// Imports comments from pull request reviews.
// https://docs.github.com/en/rest/pulls/reviews#get-a-review-for-a-pull-request
async function importReviews({ octokit, endpoint, repository, importComment }) {
  const pages = resumablePaginate({
    octokit,
    endpoint,
    type: 'pullRequestReview',
    repository,
  });

  for await (const data of pages) {
    await Promise.all(
      data.map((pullRequest) =>
        importReviewsFromPullRequest({
          octokit,
          pullRequest,
          importComment,
        })
      )
    );
  }
}

async function importReviewsFromPullRequest({
  octokit,
  pullRequest,
  importComment,
}) {
  const { data: reviews } = await octokit.pulls.listReviews({
    owner: pullRequest.base.repo.owner.login,
    repo: pullRequest.base.repo.name,
    pull_number: pullRequest.number,
  });

  await Promise.all(reviews.filter((r) => r.body.trim()).map(importComment));
}

async function getOctokit(repository) {
  const installationId =
    repository.installationId ||
    (await findInstallationIdForRepository(repository));

  return new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: github.appId,
      privateKey: github.privateKey,
      installationId,
    },
  });
}

const appOctokit = new Octokit({
  authStrategy: createAppAuth,
  auth: {
    appId: github.appId,
    privateKey: github.privateKey,
  },
});

async function findInstallationIdForRepository(repository) {
  const { owner, repo } = getOwnerAndRepo(repository);
  const { data: installation } = await appOctokit.apps.getRepoInstallation({
    owner,
    repo,
  });
  return installation.id;
}

function getOwnerAndRepo(repository) {
  const [, , , owner, repo] = repository.cloneUrl.split('/');
  return {
    owner,
    repo: repo.replace(/\.git$/, ''),
  };
}

function createGitHubImporter(octokit) {
  const commentsWithoutID = new Cache(10);
  commentsWithoutID.materialize = loadCommentsWithoutID;

  const octokitCache = new Cache(50);
  octokitCache.materialize = async (url) => await octokit.request(url);

  function getType(githubComment) {
    if ('pull_request_review_id' in githubComment) return 'pullRequestComment';
    if ('issue_url' in githubComment) return 'issueComment';
    if ('body' in githubComment) return 'pullRequestReview';
    throw new Error('Unknown comment type');
  }

  async function loadCommentsWithoutID(repoID) {
    return await SmartComment.find({
      'source.provider': 'github',
      'source.id': null,
      'githubMetadata.repo_id': repoID,
    }).lean();
  }

  return async function importComment(githubComment) {
    const type = getType(githubComment);
    const pullRequestURL =
      githubComment.pull_request_url ||
      githubComment.issue_url.replace('/issues/', '/pulls/');
    const text = githubComment.body;
    const { data: pullRequest } = await octokitCache.get(pullRequestURL);
    const { repo } = pullRequest.base;
    const { id } = githubComment;
    const otherComments = await commentsWithoutID.get(repo.id);
    const candidateForDuplicate = otherComments.find((comment) => {
      const isSameUser =
        comment.githubMetadata.user.id.toString() ===
        githubComment.user.id.toString();
      const isSimilarTime =
        differenceInMinutes(
          comment.githubMetadata.created_at,
          new Date(githubComment.created_at)
        ) <= 1;
      return isSameUser && isSimilarTime;
    });
    if (candidateForDuplicate) {
      const existingComment = await SmartComment.findById(
        candidateForDuplicate._id
      );
      existingComment.githubMetadata.type = type;
      existingComment.githubMetadata.id = id;
      await existingComment.save();
      return existingComment;
    }
    const githubMetadata = {
      type,
      id,
      filename: githubComment.path,
      repo: repo.name,
      repo_id: repo.id,
      url: repo.html_url,
      created_at: githubComment.created_at || githubComment.submitted_at,
      updated_at: githubComment.updated_at || githubComment.submitted_at,
      user: {
        id: githubComment.user.id,
        login: githubComment.user.login,
      },
      requester: pullRequest.user.login,
    };

    const [tags, reaction] = await Promise.all([
      getTags(text),
      getReaction(text),
    ]);

    return await SmartComment.findOrCreate({
      comment: text,
      githubMetadata,
      reaction: reaction?._id,
      tags: tags.map((t) => t._id),
      source: {
        origin: 'repoSync',
        provider: 'github',
        id: `${type}:${id}`,
      },
    });
  };
}

async function setSyncStarted(repository) {
  repository.set({
    'sync.status': 'started',
    'sync.startedAt': new Date(),
  });
  await repository.save();
}

async function setSyncCompleted(repository) {
  repository.set({
    'sync.status': 'completed',
    'sync.completedAt': new Date(),
  });
  await repository.save();
}

// Async iterator that paginates through GitHub resources
// and keeps track of progress (page) in the repository model.
// Consumers must process all items in a page without errors
// for the page to be considered complete.
// If any item fails to process, we'll reprocess the page
// the next time this function is called.
async function* resumablePaginate({ octokit, endpoint, type, repository }) {
  const progressKey = `sync.progress.${type}`;
  const currentPage = repository.get(progressKey)?.currentPage || 0;
  const lastPage = repository.get(progressKey)?.lastPage;

  const alreadyDone = lastPage && currentPage + 1 > lastPage;
  if (alreadyDone) {
    return;
  }

  const { owner, repo } = getOwnerAndRepo(repository);
  const pages = octokit.paginate.iterator(endpoint, {
    owner,
    repo,
    sort: 'created',
    direction: 'desc',
    page: currentPage + 1,
  });

  for await (const response of pages) {
    const url = new URL(response.url);
    const page = parseInt(url.searchParams.get('page') || 1, 10);
    const pagination = parseLinkHeader(response.headers.link);
    if (pagination.last) {
      await repository.updateOne({
        [`${progressKey}.lastPage`]: pagination.last,
      });
    }
    logger.info(`Repo sync: Processing comments ${endpoint} page ${page}`);
    yield response.data;
    await repository.updateOne({ [`${progressKey}.currentPage`]: page });
  }
}

// Parse GitHub HTTP Link header into an object
// with name and page number, e.g.:
//
//   {
//     prev: 3,
//     next: 5,
//     last: 10
//   }
//
// Adapted from https://gist.github.com/niallo/3109252.
function parseLinkHeader(header) {
  if (!header) return {};

  const parts = header.split(',');
  const object = parts.reduce((accum, part) => {
    const section = part.split(';');
    const url = new URL(section[0].replace(/<(.*)>/, '$1').trim());
    const name = section[1].replace(/rel="(.*)"/, '$1').trim();
    const page = parseInt(url.searchParams.get('page'), 10);
    return {
      ...accum,
      [name]: page,
    };
  }, {});
  return object;
}

async function getTags(text) {
  const textTags = await jaxon.getTags(text);
  const tags = await Promise.all(
    textTags.map((tag) => findTagByLabel(tag, 'smartComment'))
  );
  return tags.filter(Boolean);
}

async function getReaction(text) {
  const [textReaction] = await jaxon.getSummaries(text);
  if (textReaction) {
    return await findReactionByTitle(textReaction);
  }
  return null;
}

export { queue };
