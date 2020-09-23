import { getAll, create } from '../../utils/api';

export const initiatePasswordReset = (params) => create('/api/proxy/users/password-reset', params);
export const validatePasswordReset = (params, userId, resetToken) => getAll(`/api/proxy/users/password-reset/${resetToken}`, params);
export const resetPassword = (params) => create('/api/proxy/users/password', params);
