import { Tag } from '../../types';

export function mapTagsToOptions(tags: Array<Tag>, type: string | string[]) {
  return tags.filter((tag) => Array.isArray(type) ? type.includes(tag.type) : tag.type === type).map((tag) => ({
    label: tag.label,
    value: tag._id,
  }));
}
