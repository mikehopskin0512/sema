const checkEnv = () => ((req, res, next) => {
  if (req.get('host') !== 'app.semasoftware.com') {
    return next();
  }
  return res.status(404).send('Not found');
});

export default checkEnv;
