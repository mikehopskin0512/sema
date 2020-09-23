import { getAll, download } from '../../utils/api';

export const getReportUrl = (params, reportId, token) => getAll(`/api/proxy/reports/${reportId}`, { params }, token);
export const generatePdf = (reportId, token) => getAll(`/api/proxy/reports/${reportId}/pdf`, {}, token);
export const getPdfFile = (reportId, modeToken, token) => download(`/api/proxy/reports/${reportId}/export/${modeToken}/pdf`, {}, token);
export const getReportList = (spaceId, token) => getAll(`/api/proxy/reports/space/${spaceId}`, {}, token);
