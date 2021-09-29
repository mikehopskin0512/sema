/* eslint-disable import/prefer-default-export */
import { getAll, create } from '../../utils/api';

export const getAllEngGuides = (token, params) => getAll('/api/proxy/comments/eng-guides', { params }, token);
export const bulkCreateEngGuidesApi = (params, token) => create('/api/proxy/comments/eng-guides/bulk-create', params, token);
export const bulkUpdateEngGuidesApi = (params, token) => create('/api/proxy/comments/eng-guides/bulk-update', params, token);
