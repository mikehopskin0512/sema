import { get, create, getAll } from '../../utils/api';

export const postCollections = (body, token) => create('/api/proxy/comments/collections', body, token);
export const getCollectionByAuthor = (author, token) => get('/api/proxy/comments/collections/author', author, token);
export const getAllUserCollections = (token) => getAll('/api/proxy/comments/collections/all', {}, token);
