import { exportItem, getAll } from '../../utils/api';

export const getSearchQueries = (params) => getAll('/api/proxy/admin/search-queries', { params });
export const exportSearchQueries = (params, token) => exportItem('/api/proxy/admin/search-queries/export', params, token);
