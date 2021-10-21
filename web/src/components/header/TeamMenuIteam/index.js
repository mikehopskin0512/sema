import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import Avatar from 'react-avatar';
import styles from '../header.module.scss';
import { ViewAdmin } from '../../../data/permissions';
import usePermission from '../../../hooks/usePermission';

const TeamMenuItem = ({ role, toggleUserMenu }) => {
  const { checkAccess } = usePermission();
  return (
    <div className="has-background-white p-15">
      <Link href={role?.team?.name === 'Sema Super Team'  ? '/sema-admin/users' : '/'}>
        <div className={clsx("is-flex is-flex-wrap-wrap is-align-items-center py-5", styles.team)} onClick={toggleUserMenu}>
          <Avatar
            name={role?.team?.name || "Team"}
            src={role?.team?.avatarUrl}
            size="35"
            round
            textSizeRatio={2.5}
            className="mr-10"
            maxInitials={2}
          />
          <div>
            <p className="has-text-deep-black has-text-weight-semibold">{role.team.name}</p>
            <p className="has-text-weight-semibold is-uppercase has-text-gray-dark is-size-9">Team Account</p>
          </div>
        </div>
      </Link>
      {checkAccess({name: role?.team?.name}, ViewAdmin) && (
        <a
          className="has-text-blue-light has-text-weight-semibold is-size-7 is-small ml-40 p-5"
          href="/labels-management"
          style={{ textDecoration: 'none' }}
          onClick={toggleUserMenu}
        >
          Manage
        </a>
      )}
    </div>
  )
}

export default TeamMenuItem;