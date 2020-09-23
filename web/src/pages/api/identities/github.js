import querystring from 'querystring';

const githubClient = process.env.GITHUB_CLIENT_ID;
const githubUri = process.env.GITHUB_REDIRECT;

export default (req, res) => {
  const params = querystring.stringify({
    client_id: githubClient,
    redirect_uri: githubUri,
  });

  const url = `https://github.com/login/oauth/authorize?${params}`;
  res.writeHead(302, {
    Location: url,
  });
  res.end();
};
