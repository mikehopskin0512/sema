import { getAll, getDownload } from '../../utils/api';

export const getReportUrl = (params, token) => getAll('/v1/embedded_bi', { params }, token);
export const getRunToken = (reportId, token) => getAll(`/v1/embedded_bi/${reportId}/pdf`, {}, token);
export const getPdfFile = (reportId, modeToken, token) => getDownload(`/v1/embedded_bi/${reportId}/export/${modeToken}/pdf`, {}, token);
