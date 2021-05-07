import { Router } from 'express';
import querystring from 'querystring';
import logger from '../../shared/logger';
import { createOAuthAppAuth } from '@octokit/auth';
import { github, orgDomain, version } from '../../config';
import { getProfile } from './utils';
import { create, findByUsernameOrIdentity, updateIdentity, verifyUser } from '../../users/userService';
import { createRefreshToken, setRefreshToken, createAuthToken, createIdentityToken } from '../../auth/authService';
import { findByToken, redeemInvite } from '../../invitations/invitationService';

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

  route.get('/cb/:inviteToken?', async (req, res) => {
    const { inviteToken } = req.params;

    const auth = createOAuthAppAuth({
      clientId: github.clientId,
      clientSecret: github.clientSecret,
      code: req.query.code,
    });
    try {
      const { token } = await auth({ type: 'token' });
      if (!token) {
        return res.status(401).end('Github authentication failed.');
      }

      const profile = await getProfile(token);
      if (!profile) {
        return res.status(401).end('Unable to retrieve Github profile for user.');
      }

      // Create identity object
      const { name: fullName } = profile;

      // Github passes 'email: null' when email is set to private
      // Desturucting fallback value only works on undefined, not null
      // So need to use profile.email with fallback to handle null emails
      // and need to check for fullName before using split
      const email = profile.email || '';
      const firstName = (fullName) ? fullName.split(' ').slice(0, -1).join(' ') : '';
      const lastName = (fullName) ? fullName.split(' ').slice(-1).join(' ') : '';

      const identity = {
        provider: 'github',
        id: profile.id,
        username: profile.login,
        email,
        firstName,
        lastName,
        profileUrl: profile.url,
        avatarUrl: profile.avatar_url,
      };

      const user = await findByUsernameOrIdentity(email, identity);
      if (user) {
        // Update user with identity
        await updateIdentity(user, identity);

        // Auth Sema
        await setRefreshToken(res, await createRefreshToken(user));

        // No need to send jwt. It will pick up the refresh token cookie on frontend
        // return res.redirect(`${orgDomain}/reports`);
        return res.redirect(`${orgDomain}/invite`);
        // return res.status(201).send({ jwtToken: await createAuthToken(user) });
      }

      const identityToken = await createIdentityToken(identity);

      // Get invitation
      const invitation = await findByToken(inviteToken);
      if (!invitation) {
        throw new errors.BadRequest(`User doesn't have invitation`);
      }
      const userBody = {
        ...identity,
        username: invitation.recipient,
        terms: true,
        jobTitle: "",
        identities: [
          { ...identity }
        ]
      }
      // Create user using invited email as username
      let newUser = await create(userBody);
      if (!newUser) {
        throw new errors.BadRequest('User create error');
      }

      // Redeem Invite
      const { _id: userId, verificationToken } = newUser;
      await redeemInvite(inviteToken, userId);

      const verifiedUser = await verifyUser(verificationToken);

      // Auth Sema
      await setRefreshToken(res, await createRefreshToken(newUser));

      if (!verifiedUser) {
        throw new errors.BadRequest('Verification error');
      }
    } catch (error) {
      console.log("Error", error);
    }
    return res.redirect(`${orgDomain}/invite`);
  });
};
