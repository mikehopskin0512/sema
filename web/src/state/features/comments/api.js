import {
  getAll,
  update,
} from '../../utils/api';

export const getSmartComments = (externalId) => getAll(`/api/proxy/comments/smart`, { externalId });
export const toggleActiveCollection = (id, token) => update(`/api/proxy/comments/collections/${id}`, {}, token);
