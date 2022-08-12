import { SOCIAL_CIRCLE_TYPES, SYNC_STATUSES } from './constants';
import { DownloadIcon, LinkedinIcon, LinkIcon, TwitterIcon } from '../../../components/Icons';
import { onDownloadImage } from '../../../utils/imageHelpers';
import { shareWithLinkedIn, shareWithTwitter } from '../../../utils/socialMedia';
import { getRepoSocialGraph } from '../../../state/features/repositories/api';

const getCorrectSocialCircleLink = (link) => {
  return [
    { name: 'twitter', icon: TwitterIcon, onClick: () => shareWithTwitter({ text: 'Check out my Github Social Circle!', url: link })},
    // { name: 'facebook', icon: FacebookIcon, onClick: () => shareWithFacebook({ url: socialCircleUrl })},
    { name: 'linkedin', icon: LinkedinIcon, onClick: () => shareWithLinkedIn({ url: link })},
  ];
};

const getSocialCircleActions = ({
  ref,
  onCopy,
  type
}) => {
  if (type === SOCIAL_CIRCLE_TYPES.personal) {
    return [
      {
        name: 'download',
        icon: DownloadIcon,
        onClick: () => onDownloadImage(ref),
      },
      {
        name: 'copy',
        icon: LinkIcon,
        onClick: () => onCopy(),
        withTooltip: true,
        tooltipText: 'Copied'
      },
    ];
  } else {
    // TODO: add logic for org circle
    return [];
  }
};

const getSocialCircleTitle = (type, userName) => {
  if (type === SOCIAL_CIRCLE_TYPES.personal) {
    return `GitHub Social Circle for ${userName}`;
  } else {
    // TODO: add logic for org circle
    return null;
  }
};

const getSocialCircleAvailability = ({
  type,
  repos,
}) => {
  if (type === SOCIAL_CIRCLE_TYPES.personal) {
    if (!repos.length) return false;
    return repos.some(r => r.sync?.status === SYNC_STATUSES.COMPLETED);
  } else {
    // TODO: add logic for org circle
    return false;
  }
};

const getSocialCircleSyncState = ({
  type,
  repos,
}) => {
  if (type === SOCIAL_CIRCLE_TYPES.personal) {
    if (!repos.length) return false;
    return repos.some(r => r.sync?.status === SYNC_STATUSES.QUEUED || r.sync?.status === SYNC_STATUSES.STARTED);
  } else {
    // TODO: add logic for org circle
    return false;
  }
};

const getAllUserReposStats = async (username, repos) => {
  const requests = repos.map(r => getRepoSocialGraph({ handle: username, repoId: r }) );
  const results = await Promise.all(requests);
  const data = results.map(r => r.data?.interactionsByUsers).flat();

  const stats = {};

  data.forEach(stat => {
    if (!stats[stat.name]) {
      stats[stat.name] = stat;
    } else {
      stats[stat.name] = { ...stats[stat.name],  count: stats[stat.name].count + stat.count}
    }
  })

  return { interactions: Object.values(stats), user: results?.[0]?.data?.user ?? {} };
}


export {
  getCorrectSocialCircleLink,
  getSocialCircleActions,
  getSocialCircleTitle,
  getSocialCircleAvailability,
  getSocialCircleSyncState,
  getAllUserReposStats
};
