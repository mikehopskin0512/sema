import {
  get,
} from '../../utils/api';

export const getSmartComments = (id) => get(`/api/proxy/comments/smart`, id);
