import {
  SEMA_URL,
  SEMA_UI_URL,
  WHOAMI,
  SEMA_COOKIE_NAME,
  SEMA_COOKIE_DOMAIN,
  SEMA_CLIENT_ID,
  SEMA_CLIENT_SECRET,
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
  let interval = null;

  function startCounter(jwt) {
    if (interval) {
      clearInterval(interval);
    }

    token = jwt;
    
    if (token) {
      try {
        // Set an interval to fetch a new access token one minute before the current one expires
        const currentTime = new Date().getTime();
        const decodedAccessToken = jwt_decode(token);
        const expirationTimeAccessToken = decodedAccessToken.exp * 1000;
        const newAccessTokenTime = ((expirationTimeAccessToken - currentTime) - 60000);
        interval = setInterval(() => {
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
        Authorization: `Basic ${btoa(`${SEMA_CLIENT_ID}:${SEMA_CLIENT_SECRET}`)}`,
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

async function getNewAccessToken(cookie) {
  const authToken = await getNewAuthToken(cookie);
  const { jwtToken = null } = authToken || {};
  jwtHandler.setJwt(jwtToken);
  const tokenResponse = jwtHandler.getFinalToken();
  return tokenResponse;
}

async function processCookie(cookie) {
  const currentTime = new Date().getTime();

  // Check if there is refresh token cookie set
  if (cookie) {
    const decodedRefreshToken = jwt_decode(cookie.value);
    const expirationTimeRefreshToken = decodedRefreshToken.exp * 1000;
    // Evaluate if the refresh token has not expired
    if (expirationTimeRefreshToken > currentTime) {
      const accessToken = jwtHandler.getJwt() || null;
      // Check if there is an access token already set
      if (accessToken) {
        const decodedAccessToken = jwt_decode(accessToken);
        const expirationTimeAccessToken = decodedAccessToken.exp * 1000;
        const deltaTimeAccessToken = (expirationTimeAccessToken - currentTime) * 60000;
        // Evaluate if the access token expiration time is less or equal to one minute
        if (deltaTimeAccessToken <= 1) {
          const tokenResponse = await getNewAccessToken(cookie);
          setRequestRule(tokenResponse.token);
          return tokenResponse;
        } else {
          setRequestRule(accessToken);
          return { token: accessToken, isLoggedIn: true };
        }
      } else {
        const tokenResponse = await getNewAccessToken(cookie);
        setRequestRule(tokenResponse.token);
        return tokenResponse;
      }
    } else {
      return { token: null, isLoggedIn: false };
    }
  } else {
    return { token: null, isLoggedIn: false };
  }
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
  let { cookie, removed } = changeInfo;

  if (cookie.domain === SEMA_COOKIE_DOMAIN && cookie.name === '_phoenix') {
    if (removed === false) {
      processCookie(cookie).then((tokenResponse) => {
        sendMessageToTab(tokenResponse);
      });
    } else if (removed === true) {
      sendMessageToTab({ token: null, isLoggedIn: false });
    }
  } 
});

const sendMessageToTab = (message) => {
  chrome.tabs.query(
    { url: ['*://github.com/*/pull/*', '*://*.github.com/*/pull/*'] },
    function (tabs) {
      if (tabs.length) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          message,
          function (response) {
            console.log('tab response received');
          }
        );
      }
    }
  );
};

// Dynamic rule to intercept requests to apollo and set the authorization header | Bearer token
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
