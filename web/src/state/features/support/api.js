import { getAll, create } from '../../utils/api';

// eslint-disable-next-line import/prefer-default-export
export const sendSupport = (params, token) => create('/api/proxy/support', params, token);
export const fetchIntercomKnowledgeBase = (token) => getAll('/api/proxy/support/knowledgeBase', {}, token);