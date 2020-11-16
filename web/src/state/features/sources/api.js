import { getAll, create } from '../../utils/api';

export const postSource = (params, token) => create('/api/proxy/sources', params, token);
export const getSources = (params, token) => getAll('/api/proxy/sources', { params }, token);
export const getSourceRepos = (sourceId, token) => getAll(`/api/proxy/sources/${sourceId}/repositories`, {}, token);
