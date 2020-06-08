import Router from 'next/router';
import jwtDecode from 'jwt-decode';

import { authOperations } from '../features/auth';
import { getCookie } from './cookie';

const { hydrateUser, reauthenticate } = authOperations;
const authCookie = process.env.NEXT_PUBLIC_AUTH_JWT;

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
