import assert from 'assert';
import Cache from 'caching-map';
import { findBestMatch } from 'string-similarity';
import logger from '../shared/logger';
import { findById as findReactionById } from '../comments/reaction/reactionService';
import { findOneByLabel as findTagByLabel } from '../comments/tags/tagService';
import SmartComment from '../comments/smartComments/smartCommentModel';
import User from '../users/userModel';
import Repository from '../repositories/repositoryModel';
import {
  findByUsernameOrIdentity,
  createGhostUser,
} from '../users/userService';
import { EMOJIS } from '../comments/suggestedComments/constants';

export default function createGitHubImporter(octokit) {
  // Speed some things up.
  const unmatchedComments = getUnmatchedCommentsCache();
  const pullRequestCache = getPullRequestCache(octokit);
  const userCache = getUserCache(octokit);
  const repositoryIdCache = getRepositoryIdCache();

  return async function importComment(githubComment) {
    if (!githubComment.body) return null;

    const type = getType(githubComment);
    // Ignore issue comments that belong to GitHub issues
    // and not pull requests.
    const isIssueCommentFromGitHubIssues =
      type === 'issueComment' &&
      githubComment.html_url.split('/')[5] === 'issues';
    const userWasDeleted = !githubComment.user;
    const shouldIgnore = isIssueCommentFromGitHubIssues || userWasDeleted;
    if (shouldIgnore) return null;
    const pullRequestURL =
      githubComment.pull_request_url ||
      githubComment.issue_url.replace('/issues/', '/pulls/');

    const pullRequest = await pullRequestCache.get(pullRequestURL);
    // Sometimes we get comments for PRs that were deleted on GitHub.
    // e.g. https://api.github.com/repos/SemaSandbox/astrobee/pulls/comments/702432867
    if (!pullRequest) return null;

    const { repo, user } = pullRequest.base;
    const repositoryId = await repositoryIdCache.get(repo.id);
    const otherComments = await unmatchedComments.get(repositoryId);
    const existingComment = await findDuplicate(githubComment, otherComments);

    if (existingComment) {
      return await updateExistingSmartComment({
        githubComment,
        existingComment,
        userCache,
      });
    }
    const existingUser = await User.find({
      'identities.id': user.id,
      'identities.provider': 'github',
    });
    if (!existingUser.length) {
      await createGhostUser({
        handle: user.login,
        username: user.login,
        identities: [
          {
            provider: 'github',
            id: user.id.toString(),
            username: user.login,
            avatarUrl: user.avatar_url,
          },
        ],
        avatarUrl: user.avatar_url,
      });
    }

    return await createNewSmartComment({
      githubComment,
      pullRequest,
      userCache,
      repositoryId,
    });
  };
}

async function updateExistingSmartComment({
  githubComment,
  existingComment,
  userCache,
}) {
  const type = getType(githubComment);
  const { id } = githubComment;
  existingComment.set('githubMetadata.type', type);
  existingComment.set('githubMetadata.id', id);

  if (!existingComment.userId) {
    const user = await findOrCreateGitHubUser({
      id: githubComment.user.id,
      username: githubComment.user.login,
      userCache,
    });
    existingComment.set('userId', user);
  }

  try {
    await existingComment.save();
    return existingComment;
  } catch (error) {
    const isDuplicate = error.code === 11000 && error.keyPattern['source.id'];
    if (isDuplicate) {
      const otherComment = await SmartComment.findOne(error.keyValue);
      logger.warn(
        `GitHub comment seems to have been already imported as smart comment ${otherComment?._id} ${githubComment.url}`
      );
      return otherComment;
    }

    throw error;
  }
}

async function createNewSmartComment({
  githubComment,
  pullRequest,
  userCache,
  repositoryId,
}) {
  const type = getType(githubComment);
  const text = githubComment.body;
  const { id } = githubComment;
  const { repo } = pullRequest.base;
  const githubMetadata = {
    type,
    id,
    filename: githubComment.path,
    repo: repo.name,
    repo_id: repo.id,
    pull_number: pullRequest.number,
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
    getTags(dropQuotedText(text)),
    getReaction(dropQuotedText(text)),
  ]);

  const user = await findOrCreateGitHubUser({
    id: githubComment.user.id,
    username: githubComment.user.login,
    userCache,
  });

  const sanitizedText = removeSemaSignature(text);
  return await SmartComment.findOrCreate(
    {
      'source.provider': 'github',
      'source.id': `${type}:${id}`,
    },
    {
      'comment': sanitizedText,
      'userId': user,
      repositoryId,
      githubMetadata,
      'reaction': reaction?._id ?? SmartComment.schema.paths.reaction.default(),
      'tags': tags.map((t) => t._id),
      'source.origin': 'sync',
    }
  );
}

async function getTags(text) {
  const textTags = looksLikeSemaComment(text)
    ? extractTagsFromSemaComment(text)
    : [];
  const tags = await Promise.all(
    textTags.map((tag) => findTagByLabel(tag, 'smartComment'))
  );
  return tags.filter(Boolean);
}

async function getReaction(text) {
  if (looksLikeSemaComment(text))
    return await extractReactionFromSemaComment(text);

  return null;
}

function getType(githubComment) {
  if ('pull_request_review_id' in githubComment) return 'pullRequestComment';
  if ('issue_url' in githubComment) return 'issueComment';
  if ('body' in githubComment) return 'pullRequestReview';
  throw new Error('Unknown comment type');
}

async function findDuplicate(githubComment, otherComments) {
  const timeDifference = (comment) =>
    Math.abs(
      comment.githubMetadata.created_at - new Date(githubComment.created_at)
    );
  const githubCommentPR = getPullRequestNumberFromURL(
    githubComment.html_url || githubComment.pull_request_url
  );

  const candidates = otherComments
    .filter((comment) => {
      // At the time of writing, githubMetadata.user.id
      // contains bogus information. Comparing by login for now.
      // https://semasoftware.slack.com/archives/C01MXTW3DRS/p1653602721759599
      const isSameUser =
        comment.githubMetadata.user.login === githubComment.user.login;
      const isSimilarTime = timeDifference(comment) < 60000;
      const isSamePR =
        // Older comments created in Sema don't have a pull_number.
        'pull_number' in comment.githubMetadata
          ? githubCommentPR === comment.githubMetadata.pull_number
          : true;
      return isSameUser && isSamePR && isSimilarTime;
    })
    // Try to find the comment that is closer in time to the one
    // coming from the API.
    .sort((a, b) => timeDifference(a) - timeDifference(b));

  if (candidates.length === 0) {
    if (looksLikeSemaComment(githubComment.body)) {
      logger.warn(
        'This looks like a Sema comment, yet could not match it to a smart comment in our database',
        githubComment.html_url
      );
    }
    return null;
  }

  const { bestMatchIndex } = findBestMatch(
    githubComment.body,
    candidates.map((c) => c.comment)
  );
  const existing = candidates[bestMatchIndex];

  return await SmartComment.findById(existing._id);
}

export function removeSemaSignature(text) {
  if (looksLikeSemaComment(text)) {
    const [body] = splitSemaComment(text);
    return body;
  }

  return text;
}

function splitSemaComment(text) {
  const [rawBody, rawSignature] = dropQuotedText(text).split(
    /__\r?\n\[!\[sema-logo\].*?(?:\*\*Summary:)/im
  );

  if (rawSignature) {
    const signature = rawSignature
      .replace(/&nbsp;/g, ' ')
      .replace(/\*\*/g, '')
      .trim();
    const body = rawBody.trimEnd();
    return [body, signature];
  }

  return [rawBody];
}

function looksLikeSemaComment(text) {
  return dropQuotedText(text).includes('[![sema-logo]');
}

function dropQuotedText(text) {
  return text
    .split('\n')
    .filter((line) => !line.startsWith('> '))
    .join('\n');
}

export function extractTagsFromSemaComment(text) {
  try {
    const [, signature] = splitSemaComment(text);

    if (!signature) return [];

    return (
      signature
        .match(/Tags:(.*)$/im)?.[1]
        .split(',')
        .map((s) => s.trim()) ?? []
    );
  } catch (error) {
    logger.error(
      `Error extracting tags from Sema comment: ${error.message || error}`,
      { text }
    );
    throw error;
  }
}

export async function extractReactionFromSemaComment(text) {
  const [, signature] = splitSemaComment(text);
  if (!signature) return null;

  const emoji = EMOJIS.find((e) => signature.includes(e.github_emoji));
  if (emoji) {
    const reaction = await findReactionById(emoji._id);
    assert(reaction, `Expected to find reaction with ID ${emoji._id}`);
    return reaction;
  }
  return null;
}

async function findOrCreateGitHubUser({ id, username, userCache }) {
  const existingUser = await findByUsernameOrIdentity('', {
    provider: 'github',
    id,
  });
  if (existingUser) return existingUser;

  const githubUser = await userCache.get(username);
  return await createGhostUser({
    handle: githubUser.login,
    username: githubUser.login,
    identities: [
      {
        provider: 'github',
        id: githubUser.id.toString(),
        username: githubUser.login,
        avatarUrl: githubUser.avatar_url,
      },
    ],
    avatarUrl: githubUser.avatar_url,
  });
}

function getPullRequestNumberFromURL(stringUrl) {
  const url = new URL(stringUrl);
  const isAPI = url.hostname === 'api.github.com';
  if (isAPI) {
    const [, , , , pulls, number] = url.pathname.split('/');
    assert(pulls === 'pulls', 'Expected a URL for a pull request');
    return number;
  }
  const [, , , pull, number] = url.pathname.split('/');
  assert(pull === 'pull', 'Expected a URL for a pull request');
  return number;
}

// Cache of repository MongoDB ID → list of unmatched smart comments (no source ID).
function getUnmatchedCommentsCache() {
  const cache = new Cache(10);
  cache.materialize = async (repositoryId) =>
    await SmartComment.find({
      repositoryId,
      'source.provider': 'github',
      'source.id': null,
    }).lean();
  return cache;
}

// Cache of pull request API URL → pull request details from GitHub.
function getPullRequestCache(octokit) {
  const cache = new Cache(50);
  cache.materialize = async (url) => {
    try {
      const { data: pullRequest } = await octokit.request(url);
      return pullRequest;
    } catch (error) {
      if (error.status === 404) return null;
      throw error;
    }
  };
  return cache;
}

// Cache of user login → GitHub profile.
function getUserCache(octokit) {
  const cache = new Cache(100);
  cache.materialize = async (login) =>
    (await octokit.request('/users/{login}', { login }))?.data;
  return cache;
}

// Cache of repository external ID → MongoDB ID.
function getRepositoryIdCache() {
  const cache = new Cache(50);
  cache.materialize = async (externalId) => {
    const { _id } = await Repository.findOne({
      type: 'github',
      externalId,
    }).select('_id');
    return _id;
  };
  return cache;
}
