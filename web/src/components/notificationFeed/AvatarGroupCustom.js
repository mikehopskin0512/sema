import React from 'react';
import classNames from 'classnames';
// import { useOnClickUser } from 'react-activity-feed/dist/utils';
import { Avatar } from 'react-activity-feed';
import Tooltip from '../Tooltip';

export function AvatarGroupCustom({
  limit = 5,
  users = [],
  avatarSize = 30,
  // onClickUser,
  className,
  style
}) {
  // const handleUserClick = useOnClickUser(onClickUser);

  return (
    <div className={classNames('raf-avatar-group', className)} style={style}>
      {users.slice(0, limit).map((user, i) => (
        <div className="raf-avatar-group__avatar" key={`avatar-${i}`}>
          <Tooltip text={user.data?.name} direction="top-left">
            <Avatar
              // onClick={handleUserClick?.(user)}
              image={user.data?.profileImage}
              size={avatarSize}
              circle
            />
          </Tooltip>
        </div>
      ))}
    </div>
  );
}
