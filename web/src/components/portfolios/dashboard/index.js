import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import styles from './portfoliosDashboard.module.scss';
import { GithubIcon, EditIcon, OptionsIcon } from '../../Icons';
import { fullName, getPlatformLink } from '../../../utils';
import { DEFAULT_AVATAR } from '../../../utils/constants';
import EditPortfolio from '../editModal';
import { portfoliosOperations } from '../../../state/features/portfolios';
import EditPortfolioTitle from '../../../components/portfolios/editTitleModal';
import Avatar from 'react-avatar';
import CommentSnapshot from '../../snapshots/snapshot/CommentSnapshot';
import ChartSnapshot from '../../snapshots/snapshot/ChartSnapshot';
import DeleteModal from '../../snapshots/deleteModal';
import DropDownMenu from '../../dropDownMenu';

const { updatePortfolio } = portfoliosOperations;

const PortfolioDashboard = ({ portfolio, isPublic }) => {
  const dispatch = useDispatch();
  const { auth } = useSelector(
    (state) => ({
      auth: state.authState,
    }),
  );
  const { token = '', user: { _id: userId } } = auth;

  const [user, setUser] = useState({
    fullName: '',
    avatar: DEFAULT_AVATAR,
    username: '',
    overview: '',
  });
  const [snapshots, setSnapshots] = useState([]);
  const [isEditModalOpen, toggleEditModal] = useState(false);
  const [titleModalOpen, setTitleModalOpen] = useState(false);
  const [isDeleteModalOpen, toggleDeleteModal] = useState(false);

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

  const onDeletePortfolio = async () => {
    // const payload = await dispatch(removeSnapshot(portfolioId, snapshotId, token));
    // if (payload.status === 200) {
    //   toggleDeleteModal(false);
    // }
  };

  useEffect(() => {
    parsePortfolio(portfolio);
  }, [portfolio]);

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
      <EditPortfolio isModalActive={isEditModalOpen} toggleModalActive={toggleEditModal} profileOverview={user.overview} onSubmit={onSaveProfile} />
      <EditPortfolioTitle
        onSubmit={onSaveProfile}
        onClose={() => setTitleModalOpen(false)}
        isOpen={titleModalOpen}
        profileTitle={user.title}
      />
      <DeleteModal
        isModalActive={isDeleteModalOpen}
        toggleModalActive={toggleDeleteModal}
        onSubmit={() => onDeletePortfolio()}
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
            <div className="is-relative is-flex">
            <DropDownMenu
                isRight
                options={[
                  {
                    // TODO: add Duplicate - ETCR-1030
                    label: 'Duplicate Portfolio',
                    onClick: () => console.log('TODO: will be implement later'),
                  },
                  { 
                    label: 'Delete', onClick: () => toggleDeleteModal(true) 
                  },
                ]}
                trigger={
                  <div className="is-clickable" style={{ position: 'absolute', top: 0, right: 0}}>
                    <OptionsIcon />
                  </div>
                }
              />
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
