import { EMOJIS, TAGS } from './constants';

export const getEmoji = (id) => {
  const { emoji } = find(EMOJIS, { _id: id });
  return emoji;
};

export const getTagLabel = async (id) => {
  const { label } = find(TAGS, { _id: id });
  return label;
};