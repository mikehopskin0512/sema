import Router from 'next/router';
import jwtDecode from 'jwt-decode';

import { authOperations } from '../features/auth';
import { alertOperations } from '../features/alerts';
import { getCookie } from './cookie';
import { PATHS } from '../../utils/constants';

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
    ({ isVerified } = (jwt) ? jwtDecode(jwt) : {});
  }

  // console.log("user waitlist", ctx.store.getState().authState.user.isWaitlist)
  // console.log("jwt", jwt)
  // Redirects w/ exclusions
  if (
    !(ctx.pathname).includes(PATHS.LOGIN) &&
    !(ctx.pathname).includes(PATHS.ONBOARDING) &&
    !(ctx.pathname).includes(PATHS.GUIDES) &&
    !(ctx.pathname).includes(PATHS.REGISTER) &&
    !(ctx.pathname).includes(PATHS.PASSWORD_RESET)
  ) {
    if (!jwt) { redirect(ctx, PATHS.LOGIN); }
    if (ctx.store.getState().authState.user.isWaitlist) { redirect(ctx, PATHS.LOGIN); }
    if (!isVerified) {
      ctx.res.setHeader(
        'Set-Cookie', [`${refreshCookie}=deleted; Max-Age=0`],
      );
      redirect(ctx, PATHS.LOGIN);
    }
  }
};

export default initialize;
