import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import styles from './portfoliosDashboard.module.scss';
import { GithubIcon, EditIcon } from '../../Icons';
import { fullName, getPlatformLink } from '../../../utils';
import Snapshot from '../../snapshots/snapshot';
import { DEFAULT_AVATAR } from '../../../utils/constants';
import EditPortfolio from '../editModal';
import { portfoliosOperations } from '../../../state/features/portfolios';

const { updatePortfolio } = portfoliosOperations;

const PortfolioDashboard = ({ portfolio, isPublic }) => {
  const dispatch = useDispatch();
  const { auth } = useSelector(
    (state) => ({
      auth: state.authState,
    }),
  );
  const { token = '' } = auth;
  const [user, setUser] = useState({
    fullName: '',
    avatar: DEFAULT_AVATAR,
    username: '',
    overview: '',
  });
  const [snapshots, setSnapshots] = useState([]);
  const [isEditModalOpen, toggleEditModal] = useState(false);

  const parsePortfolio = (portfolio) => {
    if (!isEmpty(portfolio)) {
      const {
        identities = [], headline, imageUrl, overview, snapshots: snapshotsData,
      } = portfolio;
      const { username } = identities.length && identities.find((item) => item?.provider === "github");
      setUser({ fullName: fullName(portfolio), username, avatar: imageUrl, overview });
      if (snapshotsData) {
        const d = snapshotsData.map((s) => s.id);
        setSnapshots(d);
      }
    }
  };

  const onSaveProfile = async (profile) => {
    const { _id, ...rest } = portfolio
    if (_id && token) {
      const body = {
        _id,
        ...rest,
        overview: profile,
      };

      body.snapshots = body.snapshots.map(({ id: snapshot , sort }) => ({ id: { _id: snapshot._id }, sort }));
      const payload = await dispatch(updatePortfolio(_id, { ...body }, token));
      if (payload.status === 200) {
        toggleEditModal(false);
        // We might need to change this one in the future if portfolio dashboard handles multiple portfolio
        parsePortfolio(payload.data);
      }
    }
  };

  useEffect(() => {
    parsePortfolio(portfolio);
  }, [portfolio]);

  return (
    <>
      <EditPortfolio isModalActive={isEditModalOpen} toggleModalActive={toggleEditModal} profileOverview={user.overview} onSubmit={onSaveProfile} />
      <div className="portfolio-content mb-50 container">
        <div className={clsx(styles['user-summary'])}>
          <div className={clsx(styles['user-image'], '')}>
            <img className={clsx('is-rounded', styles.avatar)} src={user.avatar} alt="user_icon" />
          </div>
          <div className={clsx(styles.username, 'has-background-gray-900 pl-250 has-text-white-0 is-flex is-align-items-center')}>
            <div>
              <div className="has-text-weight-semibold is-size-4 is-flex">{user.fullName}</div>
              <div className="flex-break" />
              <div className="is-flex is-align-items-center"><GithubIcon />
                <span className="is-underlined pl-8 is-size-6">
                  <a href={getPlatformLink(user.username, 'github')} target="_blank" className='has-text-white-0'>
                    {user.username}
                  </a>
                </span>
              </div>
            </div>
          </div>
          <div className={clsx(styles['user-overview'], 'has-background-white-0 pl-230 pr-35')}>
            <div className="is-relative">
              <div className="content is-relative p-10 pr-80 pt-20">
                {user.overview}
              </div>
              {
                !isPublic && (
                  <button
                    type="button"
                    className={clsx(styles['edit-icon'], 'is-clickable is-ghost button mt-10 p-8')}
                    onClick={() => toggleEditModal(true)}
                  >
                    <EditIcon />
                  </button>
                )
              }
            </div>
          </div>
        </div>
      </div>
      <div className="snapshot-container container">
        <div className="mb-25 is-size-4 has-text-weight-semibold">Snapshots</div>
        {snapshots.map((s) => <Snapshot snapshotData={s} portfolioId={portfolio._id} />)}
      </div>
    </>
  )
};


PortfolioDashboard.defaultProps = {
  isPublic: true,
};


PortfolioDashboard.propTypes = {
  portfolio: PropTypes.object.isRequired,
  isPublic: PropTypes.bool,
};


export default PortfolioDashboard;
