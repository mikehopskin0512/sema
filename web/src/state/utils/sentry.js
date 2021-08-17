import Router from 'next/router';
import jwtDecode from 'jwt-decode';

import { authOperations } from '../features/auth';
import { alertOperations } from '../features/alerts';
import { getCookie } from './cookie';

const { refreshJwt } = authOperations;
const { triggerAlert } = alertOperations;

const refreshCookie = process.env.NEXT_PUBLIC_REFRESH_COOKIE;
const isServer = () => typeof window === 'undefined';

const redirect = (ctx, location) => {
  if (ctx.req) {
    ctx.res.writeHead(302, { Location: location }).end();
  } else {
    Router.push(location);
  }
};

const initialize = async (ctx) => {
  let jwt = null;
  let isVerified = false;
  if (isServer()) {
    // On server-side, get refreshCookie and call refreshJwt (which will return isVerified)
    jwt = getCookie(refreshCookie, ctx.req);
    const payload = (jwt) ? await ctx.store.dispatch(refreshJwt(jwt)) : {};
    ({ isVerified } = payload);
  } else {
    // On client-side, get jwt from state and decode to get isVerified
    ({ authState: { token: jwt } } = ctx.store.getState());
    const { user = {} } = (jwt) ? jwtDecode(jwt) : {};
    ({ isVerified } = user);
  }
  if (jwt && !isVerified) {
    ctx.store.dispatch(triggerAlert('User is not yet verified.', 'error'));
    ctx.res.setHeader(
      'Set-Cookie', [`${refreshCookie}=deleted; Max-Age=0`],
    );
  }
  // console.log("user waitlist", ctx.store.getState().authState.user.isWaitlist)
  // console.log("jwt", jwt)
  // Redirects w/ exclusions
  if (
    !(ctx.pathname).includes('/login') &&
    !(ctx.pathname).includes('/onboarding') &&
    !(ctx.pathname).includes('/engineering') &&
    !(ctx.pathname).includes('/register') &&
    !(ctx.pathname).includes('/password-reset')
  ) {
    if (!jwt) { redirect(ctx, '/login'); }
    if (ctx.store.getState().authState.user.isWaitlist) { redirect(ctx, '/login'); }
    if (!isVerified) { redirect(ctx, '/login'); }
  }
};

export default initialize;
