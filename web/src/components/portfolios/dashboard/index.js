import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import styles from './portfoliosDashboard.module.scss';
import { GithubIcon, EditIcon, CloseIcon, AlertFilledIcon, CheckFilledIcon } from '../../Icons';
import { fullName, getPlatformLink } from '../../../utils';
import { DEFAULT_AVATAR } from '../../../utils/constants';
import EditPortfolio from '../editModal';
import { portfoliosOperations } from '../../../state/features/portfolios';
import { snapshotsOperations } from '../../../state/features/snapshots';
import EditPortfolioTitle from '../../../components/portfolios/editTitleModal';
import Avatar from 'react-avatar';
import CommentSnapshot from '../../snapshots/snapshot/CommentSnapshot';
import ChartSnapshot from '../../snapshots/snapshot/ChartSnapshot';
import AddSnapshotModal, { ADD_SNAPSHOT_MODAL_TYPES } from '../../portfolios/addSnapshotModal';
import useAuthEffect from '../../../hooks/useAuthEffect';
import toaster from 'toasted-notes';

const { updatePortfolio } = portfoliosOperations;
const { fetchUserSnapshots } = snapshotsOperations;

const PortfolioDashboard = ({ portfolio, isPublic }) => {
  const showNotification = (isError) => {
    //ToDo: change this for new notification component after ETCR-1086 will be merged
    toaster.notify(({ onClose }) => (
      <div className={clsx('message  shadow mt-60', isError ? 'is-red-500' : 'is-success')}>
        <div className="message-body has-background-white is-flex">
          {isError ?
            <AlertFilledIcon size="small" /> :
            <CheckFilledIcon size="small" />
          }
          <div>
            <div className="is-flex is-justify-content-space-between mb-15">
              <span className="is-line-height-1 has-text-weight-semibold has-text-black ml-8">
                {isError ? 'Snapshots were not added.' : 'Snapshots were added to this portfolio'}
              </span>
              <div onClick={onClose}>
                <CloseIcon size="small" />
              </div>
            </div>
          </div>
        </div>
      </div>
    ), {
      position: 'top-right',
      duration: isError ? 3000 : null,
    });
  };

  const dispatch = useDispatch();
  const { auth } = useSelector(
    (state) => ({
      auth: state.authState,
    }),
  );
  const { user: userData, token = '' } = auth;
  const { _id: userId } = userData;

  const [user, setUser] = useState({
    fullName: '',
    avatar: DEFAULT_AVATAR,
    username: '',
    overview: '',
  });
  const [snapshots, setSnapshots] = useState([]);
  const [isEditModalOpen, toggleEditModal] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [titleModalOpen, setTitleModalOpen] = useState(false);

  const parsePortfolio = (portfolio) => {
    if (!isEmpty(portfolio)) {
      const {
        identities = [], headline, imageUrl, overview, snapshots: snapshotsData, title,
      } = portfolio;
      const { username } = identities.length && identities.find((item) => item?.provider === "github");
      setUser({ fullName: fullName(portfolio), username, avatar: imageUrl, overview, title });
      if (snapshotsData) {
        const d = snapshotsData.map((s) => s.id);
        setSnapshots(d);
      }
    }
  };

  const onSaveProfile = async (values) => {
    const { _id, ...rest } = portfolio
    if (_id && token) {
      const body = {
        _id,
        ...rest,
        ...values,
      };

      body.snapshots = body.snapshots.map(({ id: snapshot , sort }) => ({ id: { _id: snapshot._id }, sort }));
      const payload = await dispatch(updatePortfolio(_id, { ...body }, token));
      if (payload.status === 200) {
        toggleEditModal(false);
        setTitleModalOpen(false);
        // We might need to change this one in the future if portfolio dashboard handles multiple portfolio
        parsePortfolio(payload.data);
      }
    }
  };

  useEffect(() => {
    parsePortfolio(portfolio);
  }, [portfolio]);

  useAuthEffect(() => {
    dispatch(fetchUserSnapshots(userData._id, token));
  }, [userData]);
  
  const isPortfolioOwner = useCallback(() => {
    if (!isEmpty(portfolio)) {
      if (portfolio.userId === userId) {
        return true;
      }
    }
    return false;
  }, [portfolio, userId]);

  return (
    <>
      <button
        onClick={() => setIsActive(true)}
        type="button"
        className="button is-transparent"
      >
        + Add Snapshot
      </button>
      <AddSnapshotModal active={isActive} onClose={() => setIsActive(false)} type={ADD_SNAPSHOT_MODAL_TYPES.SNAPSHOTS} showNotification={showNotification}/>
      <EditPortfolio isModalActive={isEditModalOpen} toggleModalActive={toggleEditModal} profileOverview={user.overview} onSubmit={onSaveProfile} />
      <EditPortfolioTitle
        onSubmit={onSaveProfile}
        onClose={() => setTitleModalOpen(false)}
        isOpen={titleModalOpen}
        profileTitle={user.title}
      />
      <div className={clsx('has-background-white mb-10', styles.title)}>
        <div className="container py-20">
          <div className="is-relative mx-10">
            <div className="is-size-4 has-text-weight-bold">{user.title}</div>
            <div>
              {
                isPortfolioOwner() && (
                  <EditIcon className={clsx(styles['edit-icon'], 'is-clickable')} onClick={() => setTitleModalOpen(true)} />
                )
              }
            </div>
          </div>
        </div>
      </div>
      <div className="hero-body pt-20 pb-300 mx-25">
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
        <div className={clsx('container', styles['snaps-container'])}>
          <p className="mb-25 is-size-4 has-text-weight-semibold">Snapshots</p>
          {snapshots.map((s) =>
            s.componentType === 'comments' ? (
              <CommentSnapshot snapshotData={s} portfolioId={portfolio._id} />
            ) : (
              <section className={clsx(styles['chart-wrap'])}>
                <ChartSnapshot snapshotData={s} portfolioId={portfolio._id} />
              </section>
            )
          )}
        </div>
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
