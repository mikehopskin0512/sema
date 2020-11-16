import { getAll, create } from '../../utils/api';

export const postRepositories = (params, token) => create('/api/proxy/repositories', params, token);
export const getRepos = (params, token) => getAll('/api/proxy/repositories', { params }, token);
