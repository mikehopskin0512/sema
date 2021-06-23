import { getAll } from '../../utils/api';

export const getSuggestComments = (params) => getAll('/api/proxy/comments/suggested/report', { params });
