import { Router } from 'express';
import querystring from 'querystring';
import { createOAuthAppAuth } from '@octokit/auth';
import { github } from '../../../config';

const route = Router();

export default (app) => {
  app.use('/auth/github', route);

  route.get('/', async (req, res) => {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol
    const host = req.headers['x-forwarded-host'] || req.get('host')

    const params = querystring.stringify({
      client_id: github.clientId,
      redirect_uri: `${protocol}://${host}${github.callbackUrl}`
    })

    const url = `https://github.com/login/oauth/authorize?${params}`

    res.redirect(url)
  });

  route.get('/cb', async (req, res) => {
    const auth = createOAuthAppAuth({
      clientId: github.clientId,
      clientSecret:github.clientSecret,
      code: req.query.code,
    });

    const { token } = await auth({ type: "token" });

    if(!token) {
      return res.status(401).end('Github authentication failed.')
    } else {
      res.redirect('http://localhost:3000/login');
    }
  });
}
