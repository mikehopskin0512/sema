import {
  SEMA_URL,
  SEMA_UI_URL,
  WHOAMI,
  SEMA_COOKIE_NAME,
  SEMA_COOKIE_DOMAIN,
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

function JWT() {
  let token = null;
  let timer = null;

  function startCounter(jwt) {
    if (timer) {
      clearTimeout(timer);
    }
    // clear old values
    token = jwt;
    timer = null;
    if (token) {
      try {
        const decodedToken = jwt_decode(token);

        const expiration = decodedToken.exp * 1000;
        const currentTime = new Date().getTime();

        const timeDifference = expiration - currentTime;
        const newAccessTokenTime = Math.ceil(timeDifference / 2);

        timer = setTimeout(() => {
          console.log('fetching token again');
          getFinalState();
        }, newAccessTokenTime);
      } catch (err) {
        console.log(err);
      }
    }
  }

  return {
    setJwt: function (jwt) {
      startCounter(jwt);
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

const getNewAuthToken = async (cookie) => {
  const value = cookie?.value;
  let token = null;

  if (value) {
    const res = await fetch(`${SEMA_URL}/v1/auth/refresh-token`, {
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
    });
    const response = await res.text();
    token = JSON.parse(response);
  }
  return token;
};

async function getFinalState() {
  const cookie = await getCookie();
  const tokenResponse = await processCookie(cookie);
  return tokenResponse;
}

async function getCookie() {
  const cookie = await chrome.cookies.get({
    url: SEMA_UI_URL,
    name: SEMA_COOKIE_NAME,
  });
  return cookie;
}

async function processCookie(cookie) {
  const authToken = await getNewAuthToken(cookie);
  const { jwtToken = null } = authToken || {};
  jwtHandler.setJwt(jwtToken);
  const tokenResponse = jwtHandler.getFinalToken();
  setRequestRule(tokenResponse.token);
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
    console.log('cookie onchange-->', cause, removed, cookie);

    const finalCookie = removed ? null : cookie;

    processCookie(finalCookie).then((tokenResponse) => {
      chrome.tabs.query(
        { url: ['*://github.com/*/pull/*', '*://*.github.com/*/pull/*'] },
        function (tabs) {
          if (tabs.length) {
            chrome.tabs.sendMessage(
              tabs[0].id,
              tokenResponse,
              function (response) {
                console.log('tab response received');
              }
            );
          }
        }
      );
    });
  }
});

const setRequestRule = (token) => {
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1],
    addRules: [
      {
        id: 1,
        priority: 1,
        action: {
          type: 'modifyHeaders',
          requestHeaders: [
            {
              header: 'authorization',
              operation: 'set',
              value: `Bearer ${token}`,
            },
          ],
        },
        condition: { urlFilter: 'comments', domains: ['github.com'] },
      },
    ],
  });
};
