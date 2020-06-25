import Router from 'next/router';

import { authOperations } from '../features/auth';
import { getCookie } from './cookie';

const { refreshJwt } = authOperations;

const refreshCookie = process.env.NEXT_PUBLIC_REFRESH_COOKIE;
const isServer = () => typeof window === "undefined";

const redirect = (ctx, location) => {
  if (ctx.req) {
    ctx.res.writeHead(302, { Location: location });
    ctx.res.end();
  } else {
    Router.push(location);
  }
};

const initialize = async (ctx) => {

  if(isServer()) {
    const jwtCookie = getCookie(refreshCookie, ctx.req);
    if(jwtCookie) {
      await ctx.store.dispatch(refreshJwt(jwtCookie));
    } else if (ctx.pathname !== '/login' && !(ctx.pathname).includes('/register')) {
        redirect(ctx, '/login');
    }
  } else {
    const { authState: { token : jwt} } = ctx.store.getState();
    if(!jwt) {
      redirect(ctx, '/login');
    }
  }
};

export default initialize;
