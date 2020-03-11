import { getAll } from '../../utils/api';

export const getReportUrl = (params, token) => getAll('/v1/embedded_bi', { params }, token);
export const getPdfUrl = (token) => getAll('/v1/embedded_bi_pdf', {}, token);
