import { Router } from 'express';
import querystring from 'querystring';
import { createOAuthAppAuth } from '@octokit/auth';
import { github, orgDomain, version } from '../../config';
import { getProfile } from './utils';
import { findByUsername, updateIdentity } from '../../users/userService';
import { createRefreshToken, setRefreshToken, createAuthToken, createIdentityToken } from '../../auth/authService';

const route = Router();

export default (app) => {
  app.use(`/${version}/identities/github`, route);

  route.get('/', async (req, res) => {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers['x-forwarded-host'] || req.get('host');

    const params = querystring.stringify({
      client_id: github.clientId,
      redirect_uri: `${protocol}://${host}${github.callbackUrl}`,
    });

    const url = `https://github.com/login/oauth/authorize?${params}`;

    res.redirect(url);
  });

  route.get('/cb', async (req, res) => {
    const auth = createOAuthAppAuth({
      clientId: github.clientId,
      clientSecret: github.clientSecret,
      code: req.query.code,
    });

    const { token } = await auth({ type: 'token' });
    if (!token) {
      return res.status(401).end('Github authentication failed.');
    }

    const profile = await getProfile(token);
    if (!profile) {
      return res.status(401).end('Unable to retrieve Github profile for user.');
    }

    // Create identity object
    const fullName = profile.name;
    const firstName = fullName.split(' ').slice(0, -1).join(' ');
    const lastName = fullName.split(' ').slice(-1).join(' ');
    const identity = {
      provider: 'github',
      id: profile.id,
      email: profile.email,
      firstName,
      lastName,
    };

    const user = await findByUsername(profile.email);
    if (user) {
      // Update user with identity
      await updateIdentity(user, identity);

      // Auth Sema
      await setRefreshToken(res, await createRefreshToken(user));

      // No need to send jwt. It will pick up the refresh token cookie on frontend
      return res.redirect(`${orgDomain}/reports`);
      // return res.status(201).send({ jwtToken: await createAuthToken(user) });
    }

    const identityToken = await createIdentityToken(identity);
    return res.redirect(`${orgDomain}/register?token=${identityToken}`);
  });
};
