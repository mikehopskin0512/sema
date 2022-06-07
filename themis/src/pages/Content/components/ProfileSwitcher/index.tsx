import React, { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// @ts-ignore
import { updateProfile } from '../../modules/redux/action';
import styles from './profileSwitcher.module.scss';
import useOutsideClick from '../../helpers/useOutsideClick';
// @ts-ignore
import { getActiveThemeClass } from '../../../../../utils/theme';
// @ts-ignore
import { DEFAULT_PROFILE_NAME, STORAGE_ITEMS } from '../../constants';

const ProfileSwitcher = () => {
  const dispatch = useDispatch();
  // @ts-ignore
  const { selectedProfile, teams } = useSelector((state) => state);
  const [isOpen, setOpen] = useState(false);
  const menu = useRef(null);
  const isPersonalProfile = !selectedProfile._id;
  // @ts-ignore
  function onChangeProfile(profile: { name: string }) {
    dispatch(updateProfile(profile));
    localStorage.setItem(STORAGE_ITEMS.PROFILE, JSON.stringify(profile));
    setOpen(false);
  }
  useOutsideClick(menu, () => setOpen(false));

  return (
    <div
      ref={menu}
      style={{ cursor: 'pointer' }}
      className={`sema-dropdown${isOpen ? ' sema-is-active' : ''} ${styles[getActiveThemeClass()]} ${styles.wrapper}`}
    >
      <div
        className={`
          sema-dropdown-trigger
          sema-is-flex
          sema-is-align-items-center
          ${styles.triggerButton}
          ${isOpen && styles['trigger-button--active']}
        `}
        onClick={() => setOpen(!isOpen)}
      >
        <i className={`fas ${isPersonalProfile ? 'fa-user' : 'fa-users'}`} />
        <span className={`ml-2 mr-1 ${styles.title}`}>
          {selectedProfile.name}
        </span>
        <i className={`fas ${isOpen ? 'fa-caret-up' : 'fa-caret-down'}`} />
      </div>
      <div
        className={`sema-dropdown-menu py-5 px-4 ${styles.list}`}
        role="menu"
      >
        <div>
          <span className="sema-is-uppercase">
            <b>Available teams</b>
          </span>
          {/* @ts-ignore */}
          {teams?.map(({ team }) => (
            <div
              key={team._id}
              onClick={() => onChangeProfile(team)}
              className={styles['list-option']}
            >
              {team.name}
            </div>
          ))}
        </div>
        <div className="mt-3">
          <span className="sema-is-uppercase">
            <b>{DEFAULT_PROFILE_NAME}</b>
          </span>
          <div
            onClick={() => onChangeProfile({ name: DEFAULT_PROFILE_NAME })}
            className={styles['list-option']}
          >
            Personal account
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSwitcher;
