import { get, getAll, updateItem, deleteItem } from '../../utils/api';

export const getUserPortfolio = (userId, token) => getAll(`/api/proxy/users/${userId}/portfolios`, {}, token);
export const putPortfolio = (id, item, token) => updateItem('/api/proxy/portfolios', id, item, token);
export const getPortfolio = (id, token) => get('/api/proxy/portfolios', id, token);
export const deletePortfolio = (id, token) => deleteItem('/api/proxy/portfolios', id, token);
