import {
  get,
  getAll,
  update,
} from '../../utils/api';

export const getSmartComments = (params, token) => getAll('/api/proxy/comments/smart', { params }, token);
export const toggleActiveCollection = (id, params = {}, token) => update(`/api/proxy/comments/collections/${id}`, params, token);
export const getCollection = (id, token) => get('/api/proxy/comments/collections', id, token);
export const getAllCollections = (token) => getAll('/api/proxy/comments/collections/all', {}, token);
export const getSuggestedComments = (params, token) => getAll('/api/proxy/comments/suggested', { params }, token);
export const getAllSuggestedComments = (token) => getAll('/api/proxy/comments/collections/all', {}, token);
export const getSmartCommentSummary = (params, token) => getAll('/api/proxy/comments/smart/summary', { params }, token);
export const getSmartCommentOverview = (params, token) => getAll('/api/proxy/comments/smart/overview', { params }, token);
