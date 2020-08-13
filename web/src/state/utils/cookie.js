import cookie from 'js-cookie';

export const setCookie = (key, value, expires = 1) => {
  if (process.browser) {
    cookie.set(key, value, {
      expires,
      path: '/',
    });
  }
};

export const removeCookie = (key) => {
  if (process.browser) {
    cookie.remove(key, {
      expires: 1,
    });
  }
};

const getCookieFromBrowser = (key) => cookie.get(key);

const getCookieFromServer = (key, req) => {
  if (!req.headers.cookie) {
    return undefined;
  }
  const rawCookie = req.headers.cookie.split(';').find((c) => c.trim().startsWith(`${key}=`));
  if (!rawCookie) {
    return undefined;
  }
  return rawCookie.split('=')[1];
};

export const getCookie = (key, req) => (process.browser ? getCookieFromBrowser(key) : getCookieFromServer(key, req));
