import { exportItem, getAll } from '../../utils/api';

export const getUserActivityChangeMetrics = (params) => getAll('/api/proxy/comments/smart/user-activities', { params });
export const exportUserActivityChangeMetrics = (params, token) => exportItem('/api/proxy/comments/smart/user-activities/export', params, token);
export const getShareOfWalletMetrics = (params) => getAll('/api/proxy/comments/smart/metric', { params });
export const exportShareOfWalletMetrics = (params, token) => exportItem('/api/proxy/comments/smart/metric/export', params, token);
export const getGrowthOfRepositoryMetrics = (params) => getAll('/api/proxy/comments/smart/growth-repository', { params });
export const exportGrowthOfRepositoryMetrics = (params, token) => exportItem('/api/proxy/comments/smart/growth-repository/export', params, token);
