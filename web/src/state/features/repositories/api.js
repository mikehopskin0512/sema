import { getAll, create, get } from '../../utils/api';

export const postRepositories = (params, token) => create('/api/proxy/repositories', params, token);
export const getRepos = (params, token) => getAll('/api/proxy/repositories', { params }, token);
export const postAnalysis = (params, token) => create('/api/proxy/analysis', params, token);
export const getRepo = (id, token) => get(`/api/proxy/repositories/search`, id, token);
