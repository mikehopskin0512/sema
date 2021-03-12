import Router from 'next/router';
import jwtDecode from 'jwt-decode';

import { authOperations } from '../features/auth';
import { getCookie } from './cookie';

const { refreshJwt } = authOperations;

const refreshCookie = process.env.NEXT_PUBLIC_REFRESH_COOKIE;
const isServer = () => typeof window === 'undefined';

const redirect = (ctx, location) => {
  if (ctx.req) {
    ctx.res.writeHead(302, { Location: location }).end();
    // ctx.res.end();
  } else {
    console.log(`actually, let's go to ${location}`);
    Router.push(location);
  }
};

const initialize = async (ctx) => {
  let jwt = null;
  let isVerified = false;
  if (isServer()) {
    console.log("isServer");
    // On server-side, get refreshCookie and call refreshJwt (which will return isVerified)
    jwt = getCookie(refreshCookie, ctx.req);
    const payload = (jwt) ? await ctx.store.dispatch(refreshJwt(jwt)) : {};
    console.log({payload});
    ({ isVerified } = payload);
  } else {
    console.log("not isServer");
    // On client-side, get jwt from state and decode to get isVerified
    ({ authState: { token: jwt } } = ctx.store.getState());
    const { user = {} } = (jwt) ? jwtDecode(jwt) : {};
    ({ isVerified } = user);
  }

  console.log({ jwt_in_initialize: jwt });
  console.log({ isVerified_in_initialize: payload.isVerified });

  // Redirects w/ exclusions
  if (ctx.pathname !== '/login' &&
      !(ctx.pathname).includes('/register') &&
      !(ctx.pathname).includes('/password-reset')) {
    if (!jwt) { redirect(ctx, '/login'); }
    if (!isVerified) { redirect(ctx, '/register/verify'); }
  }
};

export default initialize;
