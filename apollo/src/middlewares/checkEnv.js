const checkEnv = () => ((req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }
  return res.status(404).send('Not found');
});

export default checkEnv;
