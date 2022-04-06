import { create, get, getAll, updateItem, patch, deleteItem } from '../../utils/api';

export const getUserPortfolio = (userId, token) => getAll(`/api/proxy/users/${userId}/portfolios`, {}, token);
export const putPortfolio = (id, item, token) => updateItem('/api/proxy/portfolios', id, item, token);
export const getPortfolio = (id, token) => get('/api/proxy/portfolios', id, token);
export const postSnapshotToPortfolio = (id, body, token) => create(`/api/proxy/portfolios/${id}/snapshots`, body, token);
export const deletePortfolio = (id, token) => deleteItem('/api/proxy/portfolios', id, token);
export const patchPortfolioType = (id, type, token) => patch(`/api/proxy/portfolios/${id}/type`, { type }, token);
export const createPortfolio = (portfolioData, token) => create('/api/proxy/portfolios', portfolioData, token);
