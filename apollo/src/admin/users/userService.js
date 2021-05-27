import User from '../../users/userModel';
import Invitation from '../../invitations/invitationModel';

export const listUsers = async (params) => {
  const { page, perPage = 10, search } = params;

  const query = User.find(search ? {
    $or: [
      { firstName: new RegExp(search, 'gi') },
      { lastName: new RegExp(search, 'gi') },
      { username: new RegExp(search, 'gi') },
    ],
  } : {});

  const totalCount = await User.countDocuments(query);
  if (page) {
    query.skip(page > 0 ? ((page - 1) * perPage) : 0);
  }

  query.limit(perPage);

  let users = await query.exec();

  users = await Promise.all(users.map(async (user) => {
    const pendingCount = await Invitation.countDocuments({ sender: user._id, isPending: true });
    const acceptCount = await Invitation.countDocuments({ sender: user._id, isPending: false });

    return { ...user.toJSON(), pendingCount, acceptCount };
  }));

  return { users, totalCount };
};

export const updateUserAvailableInvitesCount = async (id, params) => {
  const { amount } = params;

  const user = await User.findById(id);

  user.inviteCount += amount;

  if (user.inviteCount < 0) user.inviteCount = 0;

  await user.save();
};
