import { Router } from 'express';
import querystring from 'querystring';
import { createOAuthAppAuth } from '@octokit/auth';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import path from 'path';
import logger from '../../shared/logger';

import { github, orgDomain, version } from '../../config';
import { getProfile, getUserEmails, getRepositoryList, getRepositoriesForAuthenticatedUser, getGithubOrgsForAuthenticatedUser } from './utils';
import {
   findByUsernameOrIdentity, updateIdentity,
} from '../../users/userService';
import { createRefreshToken, setRefreshToken, createIdentityToken } from '../../auth/authService';
import {checkIfInvitedByToken, redeemInvite} from '../../invitations/invitationService';
import { createUserRole } from '../../userRoles/userRoleService';
import { getTokenData } from '../../shared/utils';
import checkEnv from '../../middlewares/checkEnv';

const swaggerDocument = yaml.load(path.join(__dirname, 'swagger.yaml'));
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

      const repositories = await getRepositoryList(token);

      const profile = await getProfile(token);
      if (!profile) {
        return res.status(401).end('Unable to retrieve Github profile for user.');
      }

      // Get array of user Emails
      const userEmails = await getUserEmails(token);
      const { email: githubPrimaryEmail = '' } = userEmails.find((item) => item.primary === true);
      const emails = userEmails.map(({ email }) => (email));

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
        email: githubPrimaryEmail,
        firstName,
        lastName,
        profileUrl: profile.url,
        avatarUrl: profile.avatar_url,
        emails,
      };

      const user = await findByUsernameOrIdentity(email, identity);
      if (user) {
        const { isWaitlist = true } = user;
        identity.repositories = user.identities[0].repositories || [];
        // Update user with identity
        await updateIdentity(user, identity);

        // await updateUserRepositoryList(user, repositories, identity);

        const tokenData = await getTokenData(user);

        // Auth Sema
        await setRefreshToken(res, tokenData, await createRefreshToken(tokenData));

        // Join the user to the selected organization
        if (inviteToken) {
          const invitation = await checkIfInvitedByToken(inviteToken);
          await createUserRole({ organization: invitation.organization, user: user._id, role: invitation.role});
          await redeemInvite(inviteToken, user._id, invitation._id);

          if (!isWaitlist && invitation.organization) {
            return res.redirect(`${orgDomain}/dashboard?inviteOrganizationId=${invitation.organization}`);
          }
        }

        if (!isWaitlist) {
          // If user is on waitlist, bypass and redirect to register page (below)
          // No need to send jwt. It will pick up the refresh token cookie on frontend
          // return res.redirect(`${orgDomain}/reports`);
          return res.redirect(`${orgDomain}/dashboard`);
          // return res.status(201).send({ jwtToken: await createAuthToken(user) });
        }
      }
      const identityToken = await createIdentityToken(identity);
      // Build redirect based on inviteToken
      const registerRedirect = (inviteToken)
        ? `${orgDomain}/register/${inviteToken}?token=${identityToken}`
        : `${orgDomain}/register?token=${identityToken}`;

      return res.redirect(registerRedirect);
    } catch (error) {
      console.log('Error ', error);
    }
    return res.redirect(`${orgDomain}/dashboard`);
  });
  
  route.get('/organizations/:token', async (req, res) => {
    try {
      const { token } = req.params;
      const { perPage, page } = req.query;
      const orgs = await getGithubOrgsForAuthenticatedUser(token, perPage, page);
      
      res.status(200).json(orgs);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });
  
  route.get('/repositories/:token', async (req, res) => {
    try {
      const { token } = req.params;
      const { perPage, page } = req.query;
      const repositories = await getRepositoriesForAuthenticatedUser(token, perPage, page);
  
      res.status(200).json(repositories);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  // Swagger route
  app.use(`/${version}/identities/github-docs`, checkEnv(), swaggerUi.serveFiles(swaggerDocument, {}), swaggerUi.setup(swaggerDocument));
};
