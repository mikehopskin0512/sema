import {
  getAll,
  update,
} from '../../utils/api';

export const getSmartComments = (externalId, token) => getAll('/api/proxy/comments/smart', { externalId }, token);
export const toggleActiveCollection = (id, token) => update(`/api/proxy/comments/collections/${id}`, {}, token);
