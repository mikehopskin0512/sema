import React from 'react'
import clsx from 'clsx';
import Avatar from 'react-avatar';
import styles from '../header.module.scss';

const UserMenuItem = ({ user, onSwitchPersonalAccount, isSelected}) => {
    const {
        firstName = '',
        lastName = '',
        roles = [],
        avatarUrl: userAvatar
    } = user;
    const fullName = `${firstName} ${lastName}`;

    return (
        <div className={`p-15 ${isSelected ? 'has-background-white' : ''}`}>
          <div onClick={onSwitchPersonalAccount}>
            <div className={clsx(`is-flex is-flex-wrap-wrap is-align-items-center py-5 ${isSelected ? 'is-justify-content-center is-flex-direction-column' : ''}`, styles.organization)}>
              <Avatar
                name={fullName}
                src={userAvatar || null}
                size="35"
                round
                textSizeRatio={2.5}
                className="mr-10"
                maxInitials={2}
              />
              <div className={`${isSelected ? 'mt-5 is-flex is-flex-direction-column is-align-items-center' : ''}`}>
                <p className="has-text-black-950 has-text-weight-semibold">{fullName}</p>
                <p className="has-text-weight-semibold is-uppercase has-text-gray-500 is-size-9">Personal Account</p>
              </div>
            </div>
          </div>
        </div>
    )
}

export default UserMenuItem
