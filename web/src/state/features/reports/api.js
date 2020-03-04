import { getAll } from '../../utils/api';

export const getReportUrl = (token) => getAll('/v1/embedded_bi', {}, token);
export const getPdfUrl = (token) => getAll('/v1/embedded_bi_pdf', {}, token);
