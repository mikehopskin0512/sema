const withCSS = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');

module.exports = {
  serverRuntimeConfig: {
    // Will only be available on server side
    APOLLO_CLIENT_ID: process.env.APOLLO_CLIENT_ID,
    APOLLO_CLIENT_SECRET: process.env.APOLLO_CLIENT_SECRET,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_BASE_URL_APOLLO: process.env.NEXT_PUBLIC_BASE_URL_APOLLO,
    NEXT_PUBLIC_AUTH_JWT: process.env.NEXT_PUBLIC_AUTH_JWT,
    NEXT_PUBLIC_HEAP_ANALYTICS_ID: process.env.NEXT_PUBLIC_HEAP_ANALYTICS_ID,
  },
  ...withSass(withCSS()),
};
