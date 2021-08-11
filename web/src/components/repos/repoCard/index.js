import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import styles from './repoCard.module.scss';
import { RepoType } from '../repoList/types';
import { repositoriesOperations } from '../../../state/features/repositories';

const { fetchRepositoryOverview } = repositoriesOperations;

const statLabels = {
  codeReview: 'Smart Code Reviews',
  smartComments: 'Smart Comments',
  smartCommenters: 'Smart Commenters',
  semaUsers: 'Sema User',
};

const RepoCard = (props) => {
  const {
    name, description, externalId,
  } = props;

  const dispatch = useDispatch();
  const { auth, repositories } = useSelector(
    (state) => ({
      alerts: state.alertsState,
      auth: state.authState,
      repositories: state.repositoriesState,
    }),
  );
  const { token } = auth;

  const [stats, setStats] = useState({});
  const [users] = useState([]);

  const onClickRepo = () => {
    // Change Redirect link when overview is done!
    window.location = `/activity/${externalId}`;
  };

  const renderStats = (label, value) => (
    <div className={clsx(
      'has-background-gray-b border-radius-8px p-15 is-full-width is-flex is-flex-direction-column is-justify-content-space-between',
    )}>
      <p className={clsx('is-size-9 has-text-weight-semibold has-text-stat is-uppercase')}>{label}</p>
      <p className="is-size-4 has-text-weight-semibold has-text-black">{value}</p>
    </div>
  );

  const renderUsers = () => (
    users.length ? (
      <>
        <div className="is-flex">
          {(users.length > 4 ? users.slice(0, 3) : users.slice(0, 4)).map((item) => (
            <figure className="image is-32x32 ml-neg8">
              <img src={item.imgUrl} alt="user" className={clsx('is-rounded', styles.avatar)} />
            </figure>
          ))}
          {users.length > 4 && (
            <div className={clsx(
              'is-fullwidth is-full-height has-background-white border-radius-16px is-flex is-align-items-center is-justify-content-center ml-neg8',
              styles['user-count'],
            )}>
              <p className="is-size-8 has-text-weight-semibold">+{users.length - 3}</p>
            </div>
          )}
        </div>
      </>
    ) : ""
  );

  useEffect(() => {
    if (!repositories?.data?.overview) {
      // TODO: it's a problem because it will rewrite all previous repoCards data
      // it needs a separate store for all the repoCards or local data in every repoCard
      dispatch(fetchRepositoryOverview(externalId, token));
    }
  }, []);

  useEffect(() => {
    setStats(repositories?.data?.overview);
  }, [repositories]);

  return (
    <div className={clsx('p-10 is-flex is-flex-grow-1 is-clickable', styles.card)} onClick={onClickRepo} aria-hidden>
      <div className="box has-background-white is-full-width p-0 border-radius-2px is-clipped is-flex is-flex-direction-column">
        <div className="has-background-gray-300 is-flex is-justify-content-space-between p-12 is-align-items-center">
          <p className="has-text-black-2 has-text-weight-semibold is-size-5">{name}</p>
          {/* <FontAwesomeIcon icon={isFavorite ? faStarSolid : faStar} size="lg" color={isFavorite ? '#FFA20F' : '#192129'} /> */}
        </div>
        <div className="is-flex-grow-1 is-flex is-flex-direction-column is-justify-content-space-between">
          <div className="px-12 is-flex is-justify-content-space-between is-flex-wrap-wrap">
            {Object.keys(statLabels).map((item, i) => (
              <div className={clsx('my-12 is-flex', styles.stat)} key={i}>
                {renderStats(statLabels[item], stats?.[item])}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Repos model isn't currently updated in RepoType
// RepoCard.propTypes = RepoType;

export default RepoCard;
