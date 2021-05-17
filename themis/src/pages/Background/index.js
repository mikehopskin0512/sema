import {
  SEMA_URL,
  SEMA_UI_URL,
  WHOAMI,
} from '../../../src/pages/Content/constants';
import jwt_decode from 'jwt-decode';

chrome.runtime.onMessageExternal.addListener(
  (message, sender, sendResponse) => {
    if (message === 'version') {
      const manifest = chrome.runtime.getManifest();
      sendResponse({
        type: 'success',
        version: manifest.version,
      });
      return true;
    }
    return true;
  }
);

// This logic lives in this file - Background script
// Cookie onChanged listener for _phoenix refresh token. Utilize/Set by Apollo and Web App
chrome.cookies.onChanged.addListener(function (changeInfo) {
  const { cookie, removed } = changeInfo;
  if (cookie.name === '_phoenix' && removed === false) {
    console.log('onChange phoenix:', cookie);
  }
});

// This logic should be trigerred on the: onAuthRequired or onBeforeRequest
// For more information visit: https://developer.chrome.com/docs/extensions/reference/webRequest/

// Fetches a new access token if refresh token has not expired
// const refreshToken = ({ value }) => {
//   return new Promise((reject, resolve) => {
//     fetch(`https://api-qa.semasoftware.com/v1/auth/${value}`, { mode: 'cors' })
//       .then((response) => response.text())
//       .then((token) => {
//         console.log('New access token: ', token);
//         resolve(JSON.parse(token));
//       })
//       .catch(function (error) {
//         reject(error);
//       });
//   });
// };

// const auth = async () => {
//   // Get refresh token cookie
//   const cookieToken = await chrome.cookies.get({
//     url: 'https://app-qa.semasoftware.com/',
//     name: '_phoenix',
//   });
//   // Verify is refresh token cookie is alive
//   var isTokenExpired = false;
//   let token = cookieToken.value;
//   let decodedToken = jwt_decode(token);
//   let currentDate = new Date();
//   // JWT exp is in seconds
//   if (decodedToken.exp * 1000 < currentDate.getTime()) {
//     isTokenExpired = true;
//   }
//   if (cookieToken && isTokenExpired) {
//     try {
//       const { jwtToken: newToken } = await refreshToken(cookieToken); // New access token generated
//     } catch (error) {
//       // If error is because the refresh token cookie has expired. Therefore it will redirect you to web app/login
//       chrome.tabs.create({ url: 'https://app-qa.semasoftware.com/login' });
//     }
//   } else {
//     // If no cookie, redirect to web app/login
//     chrome.tabs.create({ url: 'https://app-qa.semasoftware.com/login' });
//   }
// };

// auth();

const isLoggedIn = (token) => {
  let hasTokenExpired = false;
  if (!token?.value) hasTokenExpired = true;
  else {
  const jwt = token.value;
  const decodedToken = jwt_decode(jwt);
  const currentDate = new Date();
  if (decodedToken.exp * 1000 < currentDate.getTime()) {
      hasTokenExpired = true;
    }
  }
  return !hasTokenExpired;
};

function getTokenResponse(cookie) {
  let tokenResponse = { cookie: null, isLoggedIn: false };
  if (cookie) {
    tokenResponse = {
      cookie,
      isLoggedIn: isLoggedIn(cookie),
    };
  }
  return tokenResponse;
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request[WHOAMI]) {
    chrome.cookies
      .get({
        url: SEMA_UI_URL,
        name: SEMA_COOKIE_NAME,
      })
      .then((cookie) => {
        sendResponse(getTokenResponse(cookie));
      });
    return true;
  }
});
