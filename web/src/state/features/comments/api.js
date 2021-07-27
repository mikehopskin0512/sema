/* eslint-disable import/no-cycle */
import { get, getAll, update } from '../../utils/api';

export const getCollection = (id, token) => get('/api/proxy/comments/collections', id, token);
export const getAllSuggestedComments = (token) => getAll('/api/proxy/comments/collections/all', {}, token);
export const toggleActiveCollection = (id, token) => update(`/api/proxy/comments/collections/${id}`, {}, token);
