import { differenceInMinutes } from 'date-fns';
import Cache from 'caching-map';
import * as jaxon from '../shared/apiJaxon';
import { findOneByTitle as findReactionByTitle } from '../comments/reaction/reactionService';
import { findOneByLabel as findTagByLabel } from '../comments/tags/tagService';
import SmartComment from '../comments/smartComments/smartCommentModel';

export default function createGitHubImporter(octokit) {
  const commentsWithoutID = new Cache(10);
  commentsWithoutID.materialize = loadCommentsWithoutID;

  const octokitCache = new Cache(50);
  octokitCache.materialize = async (url) => await octokit.request(url);

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
    const { data: pullRequest } = await octokitCache.get(pullRequestURL);
    const { repo } = pullRequest.base;
    const { id } = githubComment;
    const otherComments = await commentsWithoutID.get(repo.id);
    const existingComment = await findDuplicate(githubComment, otherComments);
    if (existingComment) {
      existingComment.githubMetadata.type = type;
      existingComment.githubMetadata.id = id;
      await existingComment.save();
      return existingComment;
    }

    return await createNewSmartComment({
      githubComment,
      pullRequest,
    });
  };
}

async function createNewSmartComment({ githubComment, pullRequest }) {
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

function getType(githubComment) {
  if ('pull_request_review_id' in githubComment) return 'pullRequestComment';
  if ('issue_url' in githubComment) return 'issueComment';
  if ('body' in githubComment) return 'pullRequestReview';
  throw new Error('Unknown comment type');
}

async function findDuplicate(githubComment, otherComments) {
  const existing = otherComments.find((comment) => {
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

  if (existing) return await SmartComment.findById(existing._id);
  return null;
}
