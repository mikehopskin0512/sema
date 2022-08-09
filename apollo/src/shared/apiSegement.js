import Analytics from 'analytics-node';

export const SEGMENT_EVENTS = {
  NEW_ORG_DISCOVERED: 'New org discovered',
  PUBLIC_REPO_DISCOVERED: 'Public repo discovered',
  GITHUB_SYNC_REQUESTED: 'Github sync requested',
  GITHUB_SYNC_STARTED: 'Github sync started',
  GITHUB_SYNC_COMPLETED: 'Github sync completed',
  COMMENT_INGESTED: 'Comment ingested',
  ERROR_GENERATED: 'Error generated',
  GITHUB_SYNC_RESTARTED: 'Github sync re-started',
};

const segmentClient = new Analytics(process.env.SEGMENT_API_KEY);

export default segmentClient;
