function checkAccess(permission) {
  return (req, res, next) => {
    const { user, params, body } = req;
    const organizationId = params?.organizationId || body?.organizationId;
    const role = user?.roles?.find((item) => item.role && item.role[permission] && item.organization?._id == organizationId);
    if (!role) {
      return res.status(422).send({
        message: 'User does not have permission',
      });
    }
    return next();
  };
}

export default checkAccess;
