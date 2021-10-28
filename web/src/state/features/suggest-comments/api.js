import { create, exportItem, getAll, patch } from '../../utils/api';

export const getSuggestCommentsReport = (params) => getAll('/api/proxy/comments/suggested/report', { params });
export const postSuggestComment = (body, token) => create('/api/proxy/comments/suggested', body, token);
export const patchSuggestComment = (id, body, token) => patch(`/api/proxy/comments/suggested/${id}`, body, token);
export const bulkCreateSuggestedCommentsApi = (params, token) => create('/api/proxy/comments/suggested/bulk-create', params, token);
export const bulkUpdateSuggestedCommentsApi = (params, token) => create('/api/proxy/comments/suggested/bulk-update', params, token);
export const getSuggestCommentsApi = (params) => getAll('/api/proxy/comments/suggested/all-by-ids', { params });
export const exportSuggestedCommentsApi = (params, token) => exportItem('/api/proxy/comments/suggested/export', params, token);
