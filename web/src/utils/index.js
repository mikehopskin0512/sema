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

export const parseRelatedLinks = (string) => {
  const links = string.replace(/\s/g, '');
  return links.split(',');
}