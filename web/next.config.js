module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false,
      },
      {
        source: '/organization',
        destination: '/dashboard',
        permanent: false,
      },
    ];
  },
};
