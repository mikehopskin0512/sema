import { get, create } from '../../utils/api';

export const postCollections = (body, token) => create('/api/proxy/comments/collections', body, token);
export const getCollectionByAuthor = (author, token) => get('/api/proxy/comments/collections/author', author, token);
