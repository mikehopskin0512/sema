import querystring from 'querystring';

const githubClient = process.env.GITHUB_CLIENT_ID;
const githubUri = process.env.GITHUB_REDIRECT;

export default (req, res) => {
  // If an invite token is present, pass that in the GitHub redirect_uri
  const { query: { params: route = [] } } = req;
  const [inviteToken] = route;

  const githubRedirect = (inviteToken) ? `${githubUri}/${inviteToken}` : githubUri;

  const params = querystring.stringify({
    client_id: githubClient,
    redirect_uri: githubRedirect,
  });

  const url = `https://github.com/login/oauth/authorize?${params}`;
  res.writeHead(302, {
    Location: url,
  });
  res.end();
};
