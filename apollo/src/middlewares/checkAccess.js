function checkAccess(teamId, permission) {
  return (req, res, next) => {
    const { user } = req;

    const role = user?.roles?.find((item) => item.role && item.role[permission] && item?.team?._id == teamId);
    if (!role) {
      return res.status(422).send({
        message: 'User does not have permission',
      });
    }
    return next();
  };
}

export default checkAccess;
