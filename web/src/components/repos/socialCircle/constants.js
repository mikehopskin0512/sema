export const SYNC_STATUSES = {
  EMPTY: null,
  QUEUED: 'queued',
  STARTED: 'started',
  COMPLETED: 'completed',
  ERRORED: 'errored',
  UNAUTHORIZED: 'unauthorized',
}

export const SOCIAL_CIRCLE_TYPES = {
  personal: 'personal',
  org: 'org',
}

export const CIRCLE_UPDATE_INTERVAL = 5 * 1000;


export const CIRCLE_SHARE_LINK = {
  [SOCIAL_CIRCLE_TYPES.personal]: (type, handle, repos) => `${process.env.NEXT_PUBLIC_BASE_URL}/${handle}/collaboration/${type}/?${repos.map(r => `repos=${r}&`)
    .join('')
    .trim()}`,
}
