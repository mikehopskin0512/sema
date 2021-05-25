import {
  SEMA_URL,
  SEMA_UI_URL,
  WHOAMI,
  SEMA_COOKIE_NAME,
  SEMA_COOKIE_DOMAIN,
} from '../../../src/pages/Content/constants';
import jwt_decode from 'jwt-decode';
import { dec } from 'ramda';

var expirationTokenTime;
var jwtToken;
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

function JWT() {
  let token = null;
  let timer = null;

  function startCounter() {
    if (token) {
      try {
        const decodedToken = jwt_decode(token);

        const expiration = decodedToken.exp * 1000;
        const currentTime = new Date().getTime();

        const timeDifference = expiration - currentTime;
        const newAccessTokenTime = Math.ceil(timeDifference / 2);

        timer = setTimeout(() => {
          getFinalState();
        }, newAccessTokenTime);
      } catch (err) {
        console.log(err);
      }
    }
  }

  return {
    setJwt: function (jwt) {
      token = jwt;
      if (timer) {
        clearTimeout(timer);
      }
      startCounter();
    },
    getJwt: function () {
      return token;
    },
    getFinalToken: function () {
      return { token, isLoggedIn: !!token };
    },
  };
}

const jwtHandler = JWT();

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
  const cookie = await chrome.cookies.get({
    url: SEMA_UI_URL,
    name: SEMA_COOKIE_NAME,
  });

  const authToken = await getNewAuthToken(cookie);
  const { jwtToken } = authToken;
  jwtHandler.setJwt(jwtToken);
  const tokenResponse = jwtHandler.getFinalToken();
  return tokenResponse;
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request[WHOAMI]) {
    getFinalState().then((tokenResponse) => {
      sendResponse(tokenResponse);
    });
    return true;
  }
});

chrome.cookies.onChanged.addListener(function (changeInfo) {
  let { cause, cookie, removed } = changeInfo;

  const isSemaCookie =
    cookie.domain === SEMA_COOKIE_DOMAIN && cookie.name === SEMA_COOKIE_NAME;

  if (isSemaCookie) {
    getFinalState().then((tokenResponse) => {
      chrome.tabs.query(
        { url: ['*://github.com/*/pull/*', '*://*.github.com/*/pull/*'] },
        function (tabs) {
          chrome.tabs.sendMessage(
            tabs[0].id,
            tokenResponse,
            function (response) {
              console.log('tab response received');
            }
          );
        }
      );
    });
  }
});

chrome.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
    // TODO: confirm if adding/modifing auth headers actually work
    details.requestHeaders.push({
      name: 'Authorization',
      value: `Bearer ${jwtHandler.getJwt()}`,
    });
    return { requestHeaders: details.requestHeaders };
  },
  { urls: ['*://semasoftware.com/*', 'https://*.semasoftware.com/*'] },
  ['blocking', 'requestHeaders']
);
