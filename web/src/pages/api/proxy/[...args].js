import { createProxyMiddleware } from 'http-proxy-middleware';

const basicAuth = `${process.env.APOLLO_CLIENT_ID}:${process.env.APOLLO_CLIENT_SECRET}`;
const apiUrl = process.env.BASE_URL_APOLLO;

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

const proxy = createProxyMiddleware({
  target: apiUrl,
  pathRewrite: { '/api/proxy': '/v1' },
  changeOrigin: true,
  auth: basicAuth,
});

export default proxy;
