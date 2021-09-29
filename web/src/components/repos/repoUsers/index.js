import React from 'react';
import clsx from 'clsx';
import { isEmpty } from 'lodash'
import styles from './repoUsers.module.scss';

const RepoUsers = ({ users }) => (
  <div className="is-flex">
    {(users.length > 4 ? users.slice(0, 3) : users.slice(0, 4)).map((item) => (
      <img src={isEmpty(item.avatarUrl) ? '/img/default-avatar.jpg' : item.avatarUrl } alt="user" className={clsx('border-radius-16px', styles.avatar)} />
    ))}
    {users.length > 4 && (
      <div className={clsx(
        'is-fullwidth is-full-height border-radius-16px is-flex is-align-items-center is-justify-content-center ml-neg8',
        styles['user-count'],
      )}>
        <p className="is-size-8 has-text-weight-semibold">+{users.length - 3}</p>
      </div>
    )}
  </div>
);

export default RepoUsers;
