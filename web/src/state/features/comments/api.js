/* eslint-disable import/prefer-default-export */
import { update } from '../../utils/api';

export const toggleActiveCollection = (id, token) => update(`/api/proxy/comments/collections/${id}`, {}, token);
