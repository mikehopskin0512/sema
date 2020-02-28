import Router from 'next/router';
import jwtDecode from 'jwt-decode';

import { authOperations } from '../features/auth';
import { getCookie } from './cookie';
const { hydrateUser, reauthenticate } = authOperations;
const authCookie = process.env.AUTH_JWT;

export const initialize  = (ctx) =>  {

  if(ctx.isServer) {
    if(ctx.req.headers.cookie) {
      const jwt = getCookie(authCookie, ctx.req);
      if (jwt) {
        ctx.store.dispatch(reauthenticate(jwt));
        ctx.store.dispatch(hydrateUser(jwtDecode(jwt)));
      }
    }
  } else {
    const token = ctx.store.getState().authState.token;
    if(token && (ctx.pathname === '/login' || ctx.pathname === '/register')) {
      ctx.store.dispatch(hydrateUser(jwtDecode(token)));
      setTimeout(function() {
        Router.push('/');
      }, 0);
    }
  }
}
