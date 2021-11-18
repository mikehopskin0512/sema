import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import styles from './profile.module.scss';
import withLayout from '../../components/layout';
import EditModal from '../../components/profile/editModal';
import Helmet, { ProfileHelmet } from '../../components/utils/Helmet';
import { EditIcon, GithubIcon, RefreshIcon } from '../../components/Icons';

const Profile = () => {
  const auth = useSelector((state) => state.authState);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);

  const onClose = () => setEditModalIsOpen(false);

  const { user: {
    firstName,
    lastName,
    username,
    avatarUrl,
    identities = [{
      username: '',
    }],
  } } = auth;

  const onClickRefresh = () => {
    window.location.href = '/api/identities/github';
  };

  return (
    <div>
      <Helmet {...ProfileHelmet} />
      {editModalIsOpen && <EditModal onClose={onClose} />}
      <div className="my-40">
        <>
          <p className="has-text-black has-text-weight-bold is-size-4 mb-30">Profile Info</p>
          <div className={clsx('border-radius-4px p-25 has-background-white', styles.shadow)}>
            <div className="is-flex is-justify-content-space-between">
              <p className="has-text-black has-text-weight-bold is-size-6">Name and email</p>
              <button className="is-size-7 button is-white" onClick={() => setEditModalIsOpen(true)} type="button">
                <EditIcon size="small" />
                <span className="ml-8">
                  Edit
                </span>
              </button>
            </div>
            <div className="is-flex mt-20">
              <img className={clsx('mr-20', styles.avatar)} src={avatarUrl} alt="avatar" />
              <div className="is-flex is-flex-direction-column is-justify-content-center">
                <p className="has-text-black has-text-weight-semibold is-size-6">{firstName} {lastName}</p>
                <p className="has-text-black is-size-6">{username}</p>
              </div>
            </div>
          </div>
        </>
        <div className="mt-50">
          <p className="has-text-black has-text-weight-bold is-size-4 mb-30">Connected Accounts and Logins</p>
          <div className={clsx('border-radius-4px has-background-white', styles.shadow)}>
            <div className={clsx('is-flex p-25 is-justify-content-space-between is-align-items-center is-flex-wrap-wrap', styles.social)}>
              <div className="is-flex is-align-items-center">
                <GithubIcon size="large" />
                <p className="has-text-weight-bold is-size-6 has-text-black-950 ml-8 mr-15">Github</p>
                <p className="is-size-6 has-text-black">{identities[0].username}</p>
              </div>
              <button className="button is-white is-size-7 has-text-black" type="button" onClick={onClickRefresh}>
                <RefreshIcon size="small" />
                <span className="ml-8">
                  Refresh
                </span>
              </button>
            </div>
            <div>
              <div className={clsx('is-flex p-25 is-justify-content-space-between is-align-items-center', styles.social, styles.upcoming)}>
                <div className="is-flex is-align-items-center">
                  <img src="/img/icons/twitter.png" alt="twitter" className={clsx('mr-10', styles['social-icon'])} />
                  <p className="has-text-weight-bold is-size-6 has-text-black-950 mr-15">Twitter</p>
                </div>
                <p className="is-size-7 gray-dark">coming soon</p>
              </div>
              <div className={clsx('is-flex p-25 is-justify-content-space-between is-align-items-center', styles.social, styles.upcoming)}>
                <div className="is-flex is-align-items-center">
                  <img src="/img/icons/linkedIn.png" alt="linkedin" className={clsx('mr-10', styles['social-icon-small'])} />
                  <p className="has-text-weight-bold is-size-6 has-text-black-950 mr-15">LinkedIn</p>
                </div>
                <p className="is-size-7 gray-dark">coming soon</p>
              </div>
              <div className={clsx('is-flex p-25 is-justify-content-space-between is-align-items-center', styles.social, styles.upcoming)}>
                <div className="is-flex is-align-items-center">
                  <img src="/img/icons/stackOverflow.png" alt="stack overflow" className={clsx('mr-10', styles['social-icon-small'])} />
                  <p className="has-text-weight-bold is-size-6 has-text-black-950 mr-15">Stack Overflow</p>
                </div>
                <p className="is-size-7 gray-dark">coming soon</p>
              </div>
            </div>
            <div className="has-text-centered py-50">
              <p className="is-size-7 gray-dark">More connections coming later</p>
              <div className="is-flex is-justify-content-center mt-20">
                <img src="/img/icons/gitlab.png" alt="gitlab" className={clsx('mx-2', styles['social-icon-small'])} />
                <img src="/img/icons/social1.png" alt="social1" className={clsx('mx-2', styles['social-icon-small'])} />
                <img src="/img/icons/social3.png" alt="social3" className={clsx('mx-2', styles['social-icon-small'])} />
                <img src="/img/icons/social2.png" alt="social2" className={clsx('mx-2', styles['social-icon-small'])} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withLayout(Profile);
