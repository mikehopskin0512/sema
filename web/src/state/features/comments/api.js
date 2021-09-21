import {
  get,
  getAll,
  update,
} from '../../utils/api';

export const getSmartComments = (params, token) => getAll('/api/proxy/comments/smart', { params }, token);
export const toggleActiveCollection = (id, token) => update(`/api/proxy/comments/collections/${id}`, {}, token);
export const getCollection = (id, token) => get('/api/proxy/comments/collections', id, token);
export const getAllCollections = (token) => getAll('/api/proxy/comments/collections/all', {}, token);
export const getSuggestedComments = (params, token) => getAll('/api/proxy/comments/suggested', { params }, token);

