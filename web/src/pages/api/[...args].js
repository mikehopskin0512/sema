import { createProxyMiddleware } from 'http-proxy-middleware';

export const config = {
  api: {
    bodyParser: false,
  },
};

const proxy = createProxyMiddleware({
  target: process.env.BASE_URL_APOLLO,
  pathRewrite: { '^/api': '/v1' },
  auth: `${process.env.APOLLO_CLIENT_ID}:${process.env.APOLLO_CLIENT_SECRET}`,
});

export default proxy;
