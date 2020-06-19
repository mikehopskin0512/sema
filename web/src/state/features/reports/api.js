import { getAll, download } from '../../utils/api';

export const getReportUrl = (params, token) => getAll('/v1/embedded_bi', { params }, token);
export const generatePdf = (reportId, token) => getAll(`/v1/embedded_bi/${reportId}/pdf`, {}, token);
export const getPdfFile = (reportId, modeToken, token) => download(`/v1/embedded_bi/${reportId}/export/${modeToken}/pdf`, {}, token);
export const getReportList = (spaceId, token) => getAll(`/v1/embedded_bi/space/${spaceId}`, {}, token);
