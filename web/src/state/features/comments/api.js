import {
  get,
  update,
} from '../../utils/api';

export const getSmartComments = (id) => get(`/api/proxy/comments/smart`, id);
export const toggleActiveCollection = (id, token) => update(`/api/proxy/comments/collections/${id}`, {}, token);
