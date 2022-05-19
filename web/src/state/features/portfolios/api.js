import { create, get, getAll, updateItem, patch, update, deleteItem, upload } from '../../utils/api';

export const getUserPortfolio = (userId, token) => getAll(`/api/proxy/users/${userId}/portfolios`, {}, token);
export const putPortfolio = (id, item, token) => updateItem('/api/proxy/portfolios', id, item, token);
export const getPortfolio = (id, token) => get('/api/proxy/portfolios', id, token);
export const postSnapshotToPortfolio = (id, body, token) => create(`/api/proxy/portfolios/${id}/snapshots`, body, token);
export const deleteSnapshotsFromPortfolio = (id, body, token) => update(`/api/proxy/portfolios/${id}/snapshots`, body, token);
export const deletePortfolio = (id, token) => deleteItem('/api/proxy/portfolios', id, token);
export const patchPortfolioType = (id, type, token) => patch(`/api/proxy/portfolios/${id}/type`, { type }, token);
export const patchPortfolioTitle = (id, title, token) => patch(`/api/proxy/portfolios/${id}/title`, { title }, token);
export const patchPortfolioOverview = (id, overview, token) => patch(`/api/proxy/portfolios/${id}/overview`, { overview }, token);
export const createPortfolio = (portfolioData, token) => create('/api/proxy/portfolios', portfolioData, token);
export const addSnapshotToPortfolio = (portfolioId, snapshots, token) => create(`/api/proxy/portfolios/${portfolioId}/snapshots`, { snapshots }, token);
export const getPortfolioByUserHandle = (handle, id, token) => get(`/api/proxy/portfolios/${handle}/portfolio`, id, token);
export const uploadAvatar = (portfolioId, body, token) => upload(`/api/proxy/portfolios/${portfolioId}/avatar`, body, token);
