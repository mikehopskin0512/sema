import { getAll, create } from '../../utils/apiApollo';

export const initiatePasswordReset = (params) => create('/v1/users/password-reset', params);
export const validatePasswordReset = (params, userId, resetToken) => getAll(`/v1/users/password-reset/${resetToken}`, params);
export const resetPassword = (params) => create('/v1/users/password', params);
