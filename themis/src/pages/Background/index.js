import {
  SEMA_URL,
  SEMA_UI_URL,
  WHOAMI,
  SEMA_COOKIE_NAME,
  SEMA_COOKIE_DOMAIN,
} from '../../../src/pages/Content/constants';
import jwt_decode from 'jwt-decode';


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

// This logic lives in this file - Background script
// Cookie onChanged listener for _phoenix refresh token. Utilize/Set by Apollo and Web App
chrome.cookies.onChanged.addListener(function (changeInfo) {
  let { cause, cookie, removed } = changeInfo;

  const isSemaCookie =
    cookie.domain === SEMA_COOKIE_DOMAIN && cookie.name === SEMA_COOKIE_NAME;

  if (isSemaCookie) {
    if (removed) cookie = undefined;
    chrome.tabs.query(
      { url: ['*://github.com/*/pull/*', '*://*.github.com/*/pull/*'] },
      function (tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          getTokenResponse(cookie),
          function (response) {}
        );
      }
    );
  }
});

const getRefreshToken=(cookieToken)=>{
  let currentTime = new Date().getTime();
  if(expirationTokenTime==currentTime+300000){
    let interval=setInterval(()=>{
      const { jwtToken: newToken } = await refreshToken(cookieToken);
        if(newToken){
          stopInterval();
        }
    },10000);

    function stopInterval(){
      clearInterval(interval)
    }
  }
}


chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    headers.append('Authorization','Bearer ')
    details.requestHeaders['Authorization']=`Bearer ${jwtToken}`
    // for (var i = 0; i < details.requestHeaders.length; ++i) {
    //   if (details.requestHeaders[i].name === 'User-Agent') {
    //     details.requestHeaders.splice(i, 1);
    //     break;
    //   }
    // }
    return {requestHeaders: details.requestHeaders};
  },
  {urls: [ "*://semasoftware.com/*","https://*.semasoftware.com/*"]},
  ["blocking", "requestHeaders"]
);


// This logic should be trigerred on the: onAuthRequired or onBeforeRequest
// For more information visit: https://developer.chrome.com/docs/extensions/reference/webRequest/

// Fetches a new access token if refresh token has not expired
const refreshToken = ({ value }) => {
  return new Promise((reject, resolve) => {
    fetch(`https://api-qa.semasoftware.com/v1/auth/${value}`, { mode: 'cors' })
      .then((response) => response.text())
      .then((token) => {
        console.log('New access token: ', token);
        resolve(JSON.parse(token));
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

// const auth = async () => {
//   // Get refresh token cookie
//   const cookieToken = await chrome.cookies.get({
//     url: 'https://app-qa.semasoftware.com/',
//     name: SEMA_COOKIE_NAME,
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
    jwtToken=token.value;
    const decodedToken = jwt_decode(jwt);
    const currentDate = new Date();
    expirationTokenTime=decodedToken.exp * 1000;
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
  if(isLoggedIn(cookie)==true){
    getRefreshToken(jwtToken)
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
