import { get, create, getAll, update } from '../../utils/api';

export const getCollection = (id, token) => get('/api/proxy/comments/collections', id, token);
export const postCollections = (body, token) => create('/api/proxy/comments/collections', body, token);
export const getCollectionByAuthor = (author, token) => get('/api/proxy/comments/collections/author', author, token);
export const getAllUserCollections = (token) => getAll('/api/proxy/comments/collections/all', {}, token);
export const putCollection = (id, params, token) => update(`/api/proxy/comments/collections/${id}`, params, token);
