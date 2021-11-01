import { create, deleteItem, get, updateItem } from '../../utils/api';

export const getAllTags = (token) => get('/api/proxy/comments/tags', 'all', token);
export const getSuggestedCommentTags = (token) => get('/api/proxy/comments/tags', 'suggested-comment', token);
export const addTags = (body, token) => create('/api/proxy/comments/tags', body, token);
export const getTagById = (id, token) => get('/api/proxy/comments/tags', id, token);
export const deleteTag = (id, token) => deleteItem('/api/proxy/comments/tags', id, token);
export const putTag = (id, body, token) => updateItem('/api/proxy/comments/tags', id, body, token);
