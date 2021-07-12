import { getAll, create } from '../../utils/api';

export const postRepositories = (params, token) => create('/api/proxy/repositories', params, token);
export const getRepos = (params, token) => getAll('/api/proxy/repositories', { params }, token);
export const postAnalysis = (params, token) => create('/api/proxy/analysis', params, token);
export const filterSemaRepos = (params, token) => getAll('/api/proxy/repositories/sema-repositories', { params }, token);
