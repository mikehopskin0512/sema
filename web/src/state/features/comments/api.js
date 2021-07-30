import {
  get,
  getAll,
  update,
} from '../../utils/api';

export const getSmartComments = (externalId, token) => getAll('/api/proxy/comments/smart', { externalId }, token);
export const toggleActiveCollection = (id, token) => update(`/api/proxy/comments/collections/${id}`, {}, token);
export const getCollection = (id, token) => get('/api/proxy/comments/collections', id, token);
export const getAllSuggestedComments = (token) => getAll('/api/proxy/comments/collections/all', {}, token);
