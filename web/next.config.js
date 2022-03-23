module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false,
      },
      {
        source: '/team',
        destination: '/dashboard',
        permanent: false,
      },
    ];
  },
};
