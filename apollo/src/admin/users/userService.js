import User from '../../users/userModel';
import Invitation from '../../invitations/invitationModel';

export const listUsers = async (params) => {
  const { page, perPage = 50, search, status } = params;

  const query = User.find(search ? {
    $or: [
      { firstName: new RegExp(search, 'gi') },
      { lastName: new RegExp(search, 'gi') },
      { username: new RegExp(search, 'gi') },
      { 'identities.email': new RegExp(search, 'gi') },
    ],
  } : {});

  if (status) {
    const statusQuery = [];

    status.forEach((item) => {
      if (item === 'Waitlisted') {
        statusQuery.push({ isActive: true, isWaitlist: true });
      } else if (item === 'Active') {
        statusQuery.push({ isActive: true, isWaitlist: false });
      } else if (item === 'Blocked') {
        statusQuery.push({ isActive: false, isWaitlist: true });
      } else if (item === 'Disabled') {
        statusQuery.push({ isActive: false, isWaitlist: false });
      }
    });

    query.and({ $or: statusQuery });
  }

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

export const updateUserStatus = async (id, params) => {
  const { key, value } = params;

  const user = await User.findById(id);
  user[key] = value;
  await user.save();
  return { user };
};

export const getAnalytics = async () => {
  const total = await User.countDocuments();
  const active = await User.countDocuments({ isActive: true, isWaitlist: false });
  const waitlist = await User.countDocuments({ isActive: true, isWaitlist: true });
  const blocked = await User.countDocuments({ isActive: false, isWaitlist: true });
  const disabled = await User.countDocuments({ isActive: false, isWaitlist: false });

  return { total, active, waitlist, blocked, disabled };
};
