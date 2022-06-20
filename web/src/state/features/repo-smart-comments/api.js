import { create } from '../../utils/api';

export const searchRepositorySmartComments = (params, token) => create('/api/proxy/repositories/smart-comments/search', { ...params }, token);
