import assert from 'assert';
import Cache from 'caching-map';
import { findBestMatch } from 'string-similarity';
import logger from '../shared/logger';
import * as jaxon from '../shared/apiJaxon';
import {
  findOneByTitle as findReactionByTitle,
  findById as findReactionById,
} from '../comments/reaction/reactionService';
import { findOneByLabel as findTagByLabel } from '../comments/tags/tagService';
import SmartComment from '../comments/smartComments/smartCommentModel';
import {
  findByUsernameOrIdentity,
  createGhostUser,
} from '../users/userService';
import { EMOJIS } from '../comments/suggestedComments/constants';

export default function createGitHubImporter(octokit) {
  const commentsWithoutID = new Cache(10);
  commentsWithoutID.materialize = loadCommentsWithoutID;

  const octokitCache = new Cache(50);
  octokitCache.materialize = async (url) => await octokit.request(url);

  const userCache = new Cache(100);
  userCache.materialize = async (login) =>
    (await octokit.request('/users/{login}', { login }))?.data;

  async function loadCommentsWithoutID(repoID) {
    return await SmartComment.find({
      'source.provider': 'github',
      'source.id': null,
      'githubMetadata.repo_id': repoID,
    }).lean();
  }

  return async function importComment(githubComment) {
    const type = getType(githubComment);
    // Ignore issue comments that belong to GitHub issues
    // and not pull requests.
    const shouldIgnore =
      type === 'issueComment' &&
      githubComment.html_url.split('/')[5] === 'issues';
    if (shouldIgnore) return null;

    const pullRequestURL =
      githubComment.pull_request_url ||
      githubComment.issue_url.replace('/issues/', '/pulls/');
    const { data: pullRequest } = await octokitCache.get(pullRequestURL);
    const { repo } = pullRequest.base;
    const otherComments = await commentsWithoutID.get(repo.id);
    const existingComment = await findDuplicate(githubComment, otherComments);

    if (existingComment) {
      return await updateExistingSmartComment({
        githubComment,
        existingComment,
        userCache,
      });
    }

    return await createNewSmartComment({
      githubComment,
      pullRequest,
      userCache,
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

  await existingComment.save();
  return existingComment;
}

async function createNewSmartComment({
  githubComment,
  pullRequest,
  userCache,
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

  const user = await findOrCreateGitHubUser({
    id: githubComment.user.id,
    username: githubComment.user.login,
    userCache,
  });

  const sanitizedText = removeSemaSignature(text);
  return await SmartComment.findOrCreate({
    comment: sanitizedText,
    userId: user,
    githubMetadata,
    reaction: reaction?._id,
    tags: tags.map((t) => t._id),
    source: {
      origin: 'repoSync',
      provider: 'github',
      id: `${type}:${id}`,
    },
  });
}

async function getTags(text) {
  const textTags = looksLikeSemaComment(text)
    ? extractTagsFromSemaComment(text)
    : await jaxon.getTags(text);
  const tags = await Promise.all(
    textTags.map((tag) => findTagByLabel(tag, 'smartComment'))
  );
  return tags.filter(Boolean);
}

async function getReaction(text) {
  if (looksLikeSemaComment(text))
    return await extractReactionFromSemaComment(text);

  const [textReaction] = await jaxon.getSummaries(text);
  if (textReaction) {
    return await findReactionByTitle(textReaction);
  }
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

  const candidates = otherComments
    .filter((comment) => {
      // At the time of writing, githubMetadata.user.id
      // contains bogus information. Comparing by login for now.
      // https://semasoftware.slack.com/archives/C01MXTW3DRS/p1653602721759599
      const isSameUser =
        comment.githubMetadata.user.login === githubComment.user.login;
      const isSimilarTime = timeDifference(comment) < 60000;
      return isSameUser && isSimilarTime;
    })
    // Try to find the comment that is closer in time to the one
    // coming from the API.
    .sort((a, b) => timeDifference(a) - timeDifference(b));

  if (candidates.length === 0) {
    if (looksLikeSemaComment(githubComment.body)) {
      logger.warn(
        'This looks like a Sema comment, yet could not match it to a smart comment in our database',
        githubComment
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

function removeSemaSignature(text) {
  const [body] = splitSemaComment(text);
  return body;
}

function splitSemaComment(text) {
  const [rawBody, rawSignature] = text.split(
    /__\r?\n\[!\[sema-logo\].*?&nbsp;/im
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
  return text.includes('[![sema-logo]');
}

function extractTagsFromSemaComment(text) {
  const [, signature] = splitSemaComment(text);
  return (
    signature
      .match(/Tags:(.*)$/im)?.[1]
      .split(',')
      .map((s) => s.trim()) ?? []
  );
}

async function extractReactionFromSemaComment(text) {
  const [, signature] = splitSemaComment(text);
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
