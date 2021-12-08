import Role from './roleModel';

export const getRoles = async () => {
  const roles = await Role.find();
  return roles;
};
