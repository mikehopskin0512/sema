import { create } from '../../utils/api';

// eslint-disable-next-line import/prefer-default-export
export const sendSupport = (params, token) => create('/api/proxy/support', params, token);
