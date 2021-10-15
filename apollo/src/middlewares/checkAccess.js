function checkAccess(team, permission) {
  return (req, res, next) => {
    const { user } = req.user;

    // TODO this team comparsion is temporary for now
    const role = user.roles.find((item) => item.role[permission] && team.name === 'Sema Super Team');

    if (!role) {
      return res.status(422).send({
        message: 'User does not have permission',
      });
    }
    return next();
  };
}

export default checkAccess;
