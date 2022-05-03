import {
  DEFAULT_COLLECTION_NAME,
  GITHUB_URL,
  SEARCH_CATEGORY_TITLES,
  SEMA_CORPORATE_TEAM_ID,
} from './constants';

export const unshift = (arr, newval) => {
  arr.unshift(newval);
  return arr;
};

export const upsert = (arr, key, newval) => {
  const match = arr.find((item) => item._id === key);
  if (match) {
    const index = arr.findIndex(arr.find((item) => item._id === key));
    arr.splice(index, 1, newval);
  } else {
    arr.push(newval);
  }

  return arr;
};

export const fullName = (user) => {
  if (!user) return '';

  const { firstName = '', lastName = '' } = user;

  return `${firstName} ${lastName}`;
};

export const dummy = () => {};

export const getUserStatus = (user) => {
  if (user.isActive && user.isWaitlist) return 'Waitlisted';
  if (user.isActive && !user.isWaitlist) return 'Active';
  if (!user.isActive && user.isWaitlist) return 'Blocked';

  return 'Disabled';
};

export const getBadgeColor = (value) => {
  if (value === 'Waitlisted') return 'primary';
  if (value === 'Active') return 'success';
  if (value === 'Blocked') return 'danger';

  return 'dark';
};

export const makeTagsList = (orgTags, type = 'guide') => {
  if (!orgTags) return { newTags: [], existingTags: [] };

  const newTags = [];
  const existingTags = [];
  orgTags.forEach((tag) => {
    if (!tag) return;
    if (!tag.__isNew__) {
      existingTags.push(tag.value);
    } else {
      newTags.push({
        label: tag.value,
        isActive: true,
        type,
      });
    }
  });
  return {
    newTags,
    existingTags,
  };
};

export const getCharCount = (value) => {
  if (value === 'ꝏ') return 'ꝏ';
  return value?.toString()?.length || 0
}

export const parseRelatedLinks = (string) => {
  if (string) {
    const links = string.replace(/\s/g, '');
    return links.split(',');
  }
  return [];
}

export const shortenUrl = (url) => {
  if (!url) return '';
  return url.length > 50 ? url.substring(0, 50) + '...' : url;
}

export const isSuggestedCollectionTitle = (title) => title === SEARCH_CATEGORY_TITLES.COLLECTIONS;

export const isSemaDefaultCollection = (name) => name?.toLowerCase() === DEFAULT_COLLECTION_NAME;

export const isTeamDefaultCollection = (team, collection) => `${team?.name}'s Snippets` === collection?.name;

export const addTags = (tags, types) => tags
  .filter((tag) => types.some((type) => type === tag.type))
  .map(({ tag, _id, label }) => ({ value: tag || _id, label }))

export const filterNonSemaUsers = (users) => {
  return users ? users.filter((user) => !user.teams || !user.teams.length || user.teams.every((team) => team._id !== SEMA_CORPORATE_TEAM_ID)) : [];
}

export const getPlatformLink = (username, type) => {
  switch (type) {
    case 'github':
      return `${GITHUB_URL}/${username}`;
    default:
      return `${GITHUB_URL}/${username}`;
  }
}

export const isElementOverflow = (element) => {
  if (!element) return false;
  return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

export const parseEmails = (str) => {
  return str.split(/,|\|| /g).map((item) => {
    const match = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/.exec(item);
    return match ? match[1] : match;
  }).filter((item) => !!item);
}

export const isValidImageType = type => type === 'image/jpeg' || type === 'image/png' || type === 'image/heif' || type === 'image/heic';
