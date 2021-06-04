import { isTokenExpired } from '../../utils/index';
import { getCookie } from '../utils/cookie';
import { create } from '../utils/api';

import { authOperations } from '../features/auth';
const { requestRefreshTokenSuccess } = authOperations;

const refreshCookie = process.env.NEXT_PUBLIC_REFRESH_COOKIE;

export const apiMiddleware = (store) => (next) => async (action) => {
    const { authState: { token } } = store.getState();

    if (token && isTokenExpired(token)) {
        const refreshToken = getCookie(refreshCookie);
        if (refreshToken) {
            const { data: { jwtToken: token } } = await create('/api/proxy/auth/refresh-token', { refreshToken });
            store.dispatch(requestRefreshTokenSuccess(token));
        }
    }
    next(action);
};
