import { get, getAll, download } from '../../utils/apiApollo';

export const getReportUrl = (params, reportId, token) => get(`/v1/reports/${reportId}`, { params }, token);
export const generatePdf = (reportId, token) => getAll(`/v1/reports/${reportId}/pdf`, {}, token);
export const getPdfFile = (reportId, modeToken, token) => download(`/v1/reports/${reportId}/export/${modeToken}/pdf`, {}, token);
export const getReportList = (spaceId, token) => getAll(`/v1/reports/space/${spaceId}`, {}, token);
