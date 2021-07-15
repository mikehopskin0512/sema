import { exportItem, getAll } from '../../utils/api';

export const getShareOfWalletMetrics = (params) => getAll('/api/proxy/comments/smart/metric', { params });
export const exportShareOfWalletMetrics = (params, token) => exportItem('/api/proxy/comments/smart/metric/export', params, token);
