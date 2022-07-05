import { getAll, create, get } from '../../utils/api';

export const postRepositories = (params, token) => create('/api/proxy/repositories', params, token);
export const getRepos = (params, token) => getAll('/api/proxy/repositories', { params }, token);
export const postAnalysis = (params, token) => create('/api/proxy/analysis', params, token);
export const getRepo = (id, token) => get('/api/proxy/repositories/search', id, token);
export const filterSemaRepos = (params, token) => getAll('/api/proxy/repositories/sema-repositories', { params }, token);
export const getReactionsStats = (filter, token) => getAll(
  `/api/proxy/repositories/reactions?externalId=${filter.externalId}&dateTo=${filter.dateTo}&dateFrom=${filter.dateFrom}`,
  {},
  token,
);
export const getTagsStats = (filter, token) => getAll(
  `/api/proxy/repositories/tags?externalId=${filter.externalId}&dateTo=${filter.dateTo}&dateFrom=${filter.dateFrom}`,
  {},
  token,
);
export const getRepositoryOverview = (params, token) => getAll('/api/proxy/repositories/overview', { params }, token);
export const getDashboardRepositories = (params, token) => getAll('/api/proxy/repositories/dashboard', { params }, token);
export const getRepositoriesFilters = (params, token) => getAll('/api/proxy/repositories/filter-values', { params }, token);