import React from 'react';
import clsx from 'clsx';
import { isEmpty } from 'lodash';
import { DEFAULT_AVATAR } from '../../../utils/constants';
import styles from './repoUsers.module.scss';

const USERS_LIST_MAX_LENGTH = 4;
const USERS_FOLDED_LIST_LENGTH = 3;

const RepoUsers = ({ users }) => {
  const isUserListFolded = users.length > USERS_LIST_MAX_LENGTH;
  const userList = users.slice(0, isUserListFolded ? USERS_FOLDED_LIST_LENGTH : USERS_LIST_MAX_LENGTH);
  return (
    <div className="is-flex">
      {userList.map((item) => (
        <img
          key={item._id}
          src={isEmpty(item.avatarUrl) ? DEFAULT_AVATAR : item.avatarUrl}
          className={clsx('border-radius-16px', styles.avatar)}
          alt="user"
        />
      ))}
      {isUserListFolded && (
        <div className={clsx(
          'is-fullwidth is-full-height border-radius-16px is-flex is-align-items-center is-justify-content-center ml-neg8',
          styles['user-count'],
        )}>
          <p className="is-size-8 has-text-weight-semibold">+{users.length - USERS_FOLDED_LIST_LENGTH}</p>
        </div>
      )}
    </div>
  )
}

export default RepoUsers;
