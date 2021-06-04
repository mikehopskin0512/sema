import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth';
import { github, orgDomain } from '../../config';

import errors from '../../shared/errors';
import { sendEmail } from '../../shared/emailService';

export const getProfile = async (token) => {
  const octokit = new Octokit({ auth: `token ${token}` });
  const { data: user } = await octokit.users.getAuthenticated();
  return user;
};

export const getUserEmails = async (token) => {
  const octokit = new Octokit({ auth: `token ${token}` });
  const { data: userEmails } = await octokit.users.listEmailsForAuthenticated();
  return userEmails;
};

export const getAppRepos = async (token) => {
  const octokit = new Octokit({ auth: `token ${token}` });
  const { data: user } = await octokit.apps.listReposAccessibleToInstallation();
  return user;
};

// GitHub token fetch
export const fetchGithubToken = async (externalSourceId) => {
  try {
    const auth = createAppAuth({
      clientId: github.clientId,
      clientSecret: github.clientSecret,
      id: github.appId,
      installationId: externalSourceId,
      privateKey: github.privateKey,
    });

    const { token } = await auth({ type: 'installation' });
    if (!token) {
      throw new errors.NotFound(
        `No token found for installationId ${externalSourceId}`,
      );
    }

    return token;
  } catch (err) {
    // Do not return error, instead throw
    throw new errors.BadRequest(
      `Error fetching token for installationId ${externalSourceId}`,
    );
  }
};

export const checkAndSendEmail = async (user) => {
  const { username, isWaitlist = true, lastLogin } = user;
  const re = /\S+@\S+\.\S+/;
  const isEmail = re.test(username);
  if (isEmail) {
    const message = {
      recipient: username,
      url: `${orgDomain}`,
      templateName: !lastLogin && !isWaitlist ? 'accountCreated' : 'waitlisted',
    };
    await sendEmail(message);
  }
  return;
}
