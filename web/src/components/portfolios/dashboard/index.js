import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import styles from './portfoliosDashboard.module.scss';
import { GithubIcon, EditIcon, CloseIcon, AlertFilledIcon, CheckFilledIcon, ShareIcon } from '../../Icons';
import { fullName, getPlatformLink } from '../../../utils';
import { DEFAULT_AVATAR, PATHS, PORTFOLIO_TYPES, SEMA_APP_URL } from '../../../utils/constants';
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
import { gray600, black950 } from '../../../../styles/_colors.module.scss';
import ErrorPage from '../errorPage';
import Loader from '../../../components/Loader';

const { updatePortfolio, updatePortfolioType } = portfoliosOperations;
const { fetchUserSnapshots } = snapshotsOperations;

const PortfolioDashboard = ({ portfolio, isIndividualView, isPublic, isLoading }) => {
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
  const [isCopied, changeIsCopied] = useState(false);
  const [hover, setHover] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [titleModalOpen, setTitleModalOpen] = useState(false);
  const [isParsing, setIsParsing] = useState(false);

  const parsePortfolio = (portfolio) => {
    setIsParsing(true);
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
    setIsParsing(false);
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

  const isOwner = useMemo(() => portfolio.userId === auth.user._id, [portfolio, auth]);

  const onClickChild = (e) => {
    e.stopPropagation();
  };

  const isPublicPortfolio = () => portfolio.type === PORTFOLIO_TYPES.PUBLIC;
  const isPrivatePortfolio = () => portfolio.type === PORTFOLIO_TYPES.PRIVATE;

  const onChangeToggle = async () => {
    const newType = isPublicPortfolio() ? PORTFOLIO_TYPES.PRIVATE : PORTFOLIO_TYPES.PUBLIC;
    await dispatch(updatePortfolioType(portfolio._id, newType, token));
  };

  const onCopy = () => {
    navigator.clipboard.writeText(`${SEMA_APP_URL}${PATHS.PORTFOLIOS}/${portfolio._id}`);
    changeIsCopied(true);
  };

  if (isLoading || isParsing) {
    return (
      <Loader />
      )
  }

  if (!isOwner && isPrivatePortfolio() && isIndividualView) {
    return <ErrorPage />
  }

  return (
    <>
      <AddSnapshotModal active={isActive} onClose={() => setIsActive(false)} type={ADD_SNAPSHOT_MODAL_TYPES.SNAPSHOTS} showNotification={showNotification}/>
      <EditPortfolio isModalActive={isEditModalOpen} toggleModalActive={toggleEditModal} profileOverview={user.overview} onSubmit={onSaveProfile} />
      <EditPortfolioTitle
        onSubmit={onSaveProfile}
        onClose={() => setTitleModalOpen(false)}
        isOpen={titleModalOpen}
        profileTitle={user.title}
      />
      <div className={clsx('mb-10', styles.title)}>
        <div className="container py-20">
          <div className="is-relative is-flex mx-10 is-justify-content-space-between">
            <div className="is-relative is-flex">
              <div className="is-size-4 has-text-weight-bold">{user.title}</div>
              <div>
              {
                isOwner && (
                  <EditIcon className={clsx(styles['edit-icon'], 'is-clickable mt-5 ml-20')} onClick={() => setTitleModalOpen(true)} />
                )
              }
              </div>
            </div>
            <div className="is-relative is-flex">
              {isOwner && isIndividualView &&
              <div className="is-flex ml-20" style={{paddingTop: '3px'}}>
                <div className="field sema-toggle switch-input" onClick={onClickChild} aria-hidden>
                  <div className={clsx(styles['textContainer'])}>
                    {isPublicPortfolio() ?
                    (isCopied && hover && 'Copied! This portfolio is viewable with this link.') :
                    (hover && 'Change status to “Public” in order to copy sharable link.')}
                  </div>
                  <span className="mr-10 is-size-5">Public</span>
                  <input
                    id={`activeSwitch-${portfolio._id}`}
                    type="checkbox"
                    onChange={onChangeToggle}
                    name={`activeSwitch-${portfolio._id}`}
                    className="switch is-rounded"
                    checked={isPublicPortfolio()}
                  />
                  <label htmlFor={`activeSwitch-${portfolio._id}`} />
                </div>
                <div
                  onClick={isPublicPortfolio() ? onCopy : () => {}}
                  onMouseEnter={() => setHover(true)}
                  onMouseLeave={() => setHover(false)}
                >
                  <ShareIcon color={isPublicPortfolio() ? black950 : gray600}/>
                </div>
                <div className="is-size-4 mx-20" style={{color: gray600}}>|</div>
                <button
                  onClick={() => setIsActive(true)}
                  type="button"
                  className="button is-transparent m-0"
                >
                  + Add Snapshot
                </button>
              </div>}
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
  isIndividualView: false,
  isLoading: false,
};


PortfolioDashboard.propTypes = {
  portfolio: PropTypes.object.isRequired,
  isIndividualView: PropTypes.bool,
  isLoading: PropTypes.bool,
};


export default PortfolioDashboard;
