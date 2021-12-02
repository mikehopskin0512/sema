import { Tag } from '../../types';

export function mapTagsToOptions(tags: Array<Tag>, type: 'custom' | 'language') {
  return tags.filter((tag) => tag.type === type).map((tag) => ({
    label: tag.label,
    value: tag._id,
  }));
}
