import Router from 'next/router';
import jwtDecode from 'jwt-decode';

import { authOperations } from '../features/auth';
import { getCookie } from './cookie';

const { hydrateUser, reauthenticate } = authOperations;
const authCookie = process.env.AUTH_JWT || 'sema';

export const initialize = async (ctx) => {
  const jwt = getCookie(authCookie, ctx.req);

  if (!jwt) {
    if (ctx.pathname !== '/login') redirect(ctx, '/login');
  } else {
    ctx.store.dispatch(reauthenticate(jwt));
    ctx.store.dispatch(hydrateUser(jwtDecode(jwt)));
  }
};

const redirect = (ctx, location) => {
  if (ctx.req) {
    ctx.res.writeHead(302, { Location: location });
    ctx.res.end();
  } else {
    Router.push(location);
  }
};
