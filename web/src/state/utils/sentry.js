import Router from 'next/router';
import getConfig from 'next/config';
import jwtDecode from 'jwt-decode';

import { authOperations } from '../features/auth';
import { getCookie } from './cookie';

const { publicRuntimeConfig: { NEXT_PUBLIC_AUTH_JWT } } = getConfig();
const authCookie = NEXT_PUBLIC_AUTH_JWT;

const { hydrateUser, reauthenticate } = authOperations;

const redirect = (ctx, location) => {
  if (ctx.req) {
    ctx.res.writeHead(302, { Location: location });
    ctx.res.end();
  } else {
    Router.push(location);
  }
};

const initialize = async (ctx) => {
  const jwt = getCookie(authCookie, ctx.req);

  if (!jwt) {
    if (ctx.pathname !== '/login' && !(ctx.pathname).includes('/register')) redirect(ctx, '/login');
  } else {
    ctx.store.dispatch(reauthenticate(jwt));
    ctx.store.dispatch(hydrateUser(jwtDecode(jwt)));
  }
};

export default initialize;
