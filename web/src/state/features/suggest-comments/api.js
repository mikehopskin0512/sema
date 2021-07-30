import { create, getAll } from '../../utils/api';

export const getSuggestComments = (params) => getAll('/api/proxy/comments/suggested/report', { params });
export const postSuggestComment = (body, token) => create('/api/proxy/comments/suggested', body, token);
