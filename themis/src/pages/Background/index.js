import {
  SEMA_URL,
  SEMA_UI_URL,
  WHOAMI,
  SEMA_COOKIE_NAME,
  SEMA_COOKIE_DOMAIN,
} from '../../../src/pages/Content/constants';
import jwt_decode from 'jwt-decode';

// var expirationTokenTime;
// var jwtToken;
// chrome.runtime.onMessageExternal.addListener(
//   (message, sender, sendResponse) => {
//     if (message === 'version') {
//       const manifest = chrome.runtime.getManifest();
//       sendResponse({
//         type: 'success',
//         version: manifest.version,
//       });
//       return true;
//     }
//     return true;
//   }
// );

// chrome.cookies.onChanged.addListener(function (changeInfo) {
//   let { cause, cookie, removed } = changeInfo;

//   const isSemaCookie =
//     cookie.domain === SEMA_COOKIE_DOMAIN && cookie.name === SEMA_COOKIE_NAME;

//   if (isSemaCookie) {
//     if (removed) cookie = undefined;
//     chrome.tabs.query(
//       { url: ['*://github.com/*/pull/*', '*://*.github.com/*/pull/*'] },
//       function (tabs) {
//         chrome.tabs.sendMessage(
//           tabs[0].id,
//           getTokenResponse(cookie),
//           function (response) {}
//         );
//       }
//     );
//   }
// });

// const getRefreshToken = (cookieToken) => {
//   let currentTime = new Date().getTime();
//   if (expirationTokenTime == currentTime + 300000) {
//     let interval = setInterval(async () => {
//       const { newjwt: newToken } = await refreshToken(cookieToken);
//       if (newToken) {
//         jwtToken = newjwt;
//         stopInterval();
//       }
//     }, 10000);

//     function stopInterval() {
//       clearInterval(interval);
//     }
//   }
// };

// chrome.webRequest.onBeforeSendHeaders.addListener(
//   function (details) {
//     details.requestHeaders['Authorization'] = `Bearer ${jwtToken}`;
//     // for (var i = 0; i < details.requestHeaders.length; ++i) {
//     //   if (details.requestHeaders[i].name === 'User-Agent') {
//     //     details.requestHeaders.splice(i, 1);
//     //     break;
//     //   }
//     // }
//     return { requestHeaders: details.requestHeaders };
//   },
//   { urls: ['*://semasoftware.com/*', 'https://*.semasoftware.com/*'] },
//   ['blocking', 'requestHeaders']
// );

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

// const isLoggedIn = (token) => {
//   let hasTokenExpired = false;
//   if (!token?.value) hasTokenExpired = true;
//   else {
//     const jwt = token.value;
//     jwtToken = token.value;
//     const decodedToken = jwt_decode(jwt);
//     const currentDate = new Date();
//     expirationTokenTime = decodedToken.exp * 1000;
//     if (decodedToken.exp * 1000 < currentDate.getTime()) {
//       hasTokenExpired = true;
//     }
//   }
//   return !hasTokenExpired;
// };

// function getTokenResponse(cookie) {
//   let tokenResponse = { cookie: null, isLoggedIn: false };
//   if (cookie) {
//     tokenResponse = {
//       cookie,
//       isLoggedIn: isLoggedIn(cookie),
//     };
//   }
//   if (isLoggedIn(cookie) == true) {
//     getRefreshToken(jwtToken);
//   }
//   if (cookie && isLoggedIn(cookie) == false) {
//     jwtToken = undefined;
//   }
//   return tokenResponse;
// }

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request[WHOAMI]) {
//     chrome.cookies
//       .get({
//         url: SEMA_UI_URL,
//         name: SEMA_COOKIE_NAME,
//       })
//       .then((cookie) => {
//         sendResponse(getTokenResponse(cookie));
//       });
//     return true;
//   }
// });

/////////////

function JWT() {
  let token = null;
  let timer = null;

  function startCounter() {
    debugger;
    if (token) {
      const decodedToken = jwt_decode(token);
      console.log('decoeded token->', decodedToken);
      const currentDate = new Date();
      expirationTokenTime = decodedToken.exp * 1000;
      // TODO: get token expiration
      const tokenExpiration = 1000000;

      timer = setTimeout(() => {
        getFinalState();
      }, tokenExpiration);
    }
  }

  return {
    setJwt: function (jwt) {
      debugger;
      token = jwt;
      if (timer) {
        clearTimeout(timer);
      }
      startCounter();
    },
    getFinalToken: function () {
      return { token, isLoggedIn: !!token };
    },
  };
}

const jwtHandler = JWT();

// cookie -> access -> apollo

const getNewAuthToken = async ({ value }) => {
  const res = await fetch(
    `https://api-qa.semasoftware.com/v1/auth/refresh-token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // TODO: change to take from env? - do base64 programatically
        Authorization: `Basic M2Y4ODM4NjAtODYyZS00YTQ5LWIxNDktZjU2MzcxZTg3ZTg4OmQ3ZjNiODI1LWJmOTctNGYyMS1iYWJjLWNmMDNhMWJhYmU5MQ=="`,
      },
      body: JSON.stringify({
        refreshToken: value,
      }),

      mode: 'cors',
    }
  );
  const response = await res.text();
  console.log(`${value} response is-->`, response);

  let token = response;
  try {
    token = JSON.parse(response);
  } catch (err) {
    console.error(token);
    console.error(err);
  }
  return token;
};

async function getFinalState() {
  console.log('INSIDE FINAL STATE');
  debugger;
  const cookie = await chrome.cookies.get({
    url: SEMA_UI_URL,
    name: SEMA_COOKIE_NAME,
  });

  const authToken = await getNewAuthToken(cookie);
  jwtHandler.setJwt(authToken);
  tokenResponse = jwtHandler.getFinalToken();
  return tokenResponse;
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(`INSIDE ${request[WHOAMI]}`);
  if (request[WHOAMI]) {
    getFinalState().then((tokenResponse) => {
      sendResponse(tokenResponse);
    });
    return true;
  }
});
