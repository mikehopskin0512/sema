import UserRole from './userRoleModel';

export const updateRole = async (userRoleId, data) => {
  const role = await UserRole.updateOne({ _id: userRoleId }, { ...data });
  
  return { role };
};

export const deleteUserRole = async (userRoleId) => {
  await UserRole.deleteOne({ _id: userRoleId });
};
