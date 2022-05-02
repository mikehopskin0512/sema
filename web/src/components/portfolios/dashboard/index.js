import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router'
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import styles from './portfoliosDashboard.module.scss';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { AlertFilledIcon, CheckFilledIcon, CloseIcon, EditIcon, GithubIcon, OptionsIcon, ShareIcon, CameraIcon, PdfIcon } from '../../Icons';
import TitleField from '../TitleField';
import { fullName, getPlatformLink, isValidImageType } from '../../../utils';
import { ALERT_TYPES, DEFAULT_AVATAR, PATHS, PORTFOLIO_TYPES, RESPONSE_STATUSES, SEMA_APP_URL } from '../../../utils/constants';
import EditPortfolio from '../editModal';
import { portfoliosOperations } from '../../../state/features/portfolios';
import DashboardDraggableList from './dnd/dashboardList';
import { changePortfolioOrder, getNewLayoutItems, getPageLayout, getSavedData, getSnapsIds } from './dnd/helpers';
import { black950, gray600, white50 } from '../../../../styles/_colors.module.scss';
import toaster from 'toasted-notes';
import DeleteModal from '../../snapshots/deleteModal';
import DropDownMenu from '../../dropDownMenu';
import { alertOperations } from '../../../state/features/alerts';
import ErrorPage from '../errorPage';
import AddModal from '../addModal';
import PortfolioGuideBanner from '../../../components/banners/portfolioGuide';
import Loader from '../../../components/Loader';
import AddPortfolioAvatarModal from '../avatarModals/addPortfolioAvatarModal';
import ChangePortfolioAvatarModal from '../avatarModals/changePortfolioAvatarModal';
import ErrorPortfolioAvatarModal from '../avatarModals/errorPortfolioAvatarModal';
import { BYTES_IN_MEGABYTE, MAXIMUM_SIZE_IN_MEGABYTES, UPLOAD_AVATAR_ERROR_MESSAGE } from '../avatarModals/constants';
import { createNewPortfolio } from '../../../state/features/portfolios/actions';
import { notify } from '../../../components/toaster/index';

const { updatePortfolioType, removePortfolio, uploadPortfolioAvatar } = portfoliosOperations;
const { triggerAlert } = alertOperations;

const PortfolioDashboard = ({ portfolio, isIndividualView, isLoading, pdfView, savePdf }) => {
  const router = useRouter();
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
            <div className="is-flex is-justify-content-space-between">
              <span className="is-line-height-1 has-text-weight-semibold has-text-black ml-8">
                {isError ? 'Snapshots were not added.' : 'Snapshots were added to this portfolio'}
              </span>
              <div className="ml-30" onClick={onClose}>
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
  const { auth, portfolios, error } = useSelector(
    (state) => ({
      auth: state.authState,
      portfolios: state.portfoliosState.data.portfolios,
      error: state.portfoliosState.error,
    }),
  );
  const { token = '', user: userData } = auth;
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
  const [isParsing, setIsParsing] = useState(false);
  const [isDeleteModalOpen, toggleDeleteModal] = useState(false);
  const isOwner = portfolio.userId === auth.user._id;
  const isPublicPortfolio = portfolio.type === PORTFOLIO_TYPES.PUBLIC;
  const isPrivatePortfolio = portfolio.type === PORTFOLIO_TYPES.PRIVATE;
  const isLoadingScreen = isLoading || isParsing || !portfolio || !portfolio._id;
  const [isAddModalOpen, toggleAddModal] = useState(false);
  const [isAddAvatarModalOpen, toggleAddAvatarModal] = useState(false);
  const [isErrorAvatarModalOpen, toggleErrorAvatarModal] = useState(false);
  const [isChangeAvatarModalOpen, toggleChangeAvatarModal] = useState(false);
  const [file, setFile] = useState(null);

  const parsePortfolio = (portfolio) => {
    setIsParsing(true);
    if (!isEmpty(portfolio)) {
      const {
        identities = [], headline, imageUrl, overview, snapshots: snapshotsData, title,
      } = portfolio;
      const { username } = identities.length && identities.find((item) => item?.provider === 'github');
      setUser({ fullName: fullName(portfolio), username, avatar: imageUrl, overview, title });
      if (snapshotsData) {
        const d = snapshotsData.map((s) => s.id);
        setSnapshots(d);
      }
    }
    setIsParsing(false);
  };

  const onDeletePortfolio = async () => {
    const payload = await dispatch(removePortfolio(portfolio._id, token));
    toggleDeleteModal(false);
    await router.push(PATHS.PORTFOLIO.PORTFOLIOS);
    if (payload.status === RESPONSE_STATUSES.SUCCESS) {
      dispatch(triggerAlert(`Portfolio was successfully deleted`, ALERT_TYPES.SUCCESS));
    } else {
      dispatch(triggerAlert(`Portfolio was not deleted`, ALERT_TYPES.ERROR));
    }
  };

  useEffect(() => {
    parsePortfolio(portfolio);
  }, [portfolio?.snapshots?.length]);

  const onClickChild = (e) => {
    e.stopPropagation();
  };

  const layout = useMemo(() => {
    if (portfolio && snapshots) {
      if (portfolio.layout?.length) {
        // Reload list if new items appears
        const newItemsIds = getNewLayoutItems(snapshots.map(i => i?._id), getSnapsIds(portfolio.layout)) ?? [];

        const newItems = snapshots?.filter(i => newItemsIds.includes(i._id));
        return newItems.length ?
          [...getSavedData(portfolio.layout, snapshots), ...getPageLayout(newItems, portfolio)]
          : getSavedData(portfolio.layout, snapshots);
      }
      return getPageLayout(snapshots, portfolio);
    }
  }, [portfolio, snapshots, user]);

  const onLayoutChange = async (currentLayout) => changePortfolioOrder({
    portfolio,
    token,
    currentLayout,
  });

  const onChangeToggle = async () => {
    const newType = isPublicPortfolio ? PORTFOLIO_TYPES.PRIVATE : PORTFOLIO_TYPES.PUBLIC;
    await dispatch(updatePortfolioType(portfolio._id, newType));
  };

  const goToAddPortfolio = async () => {
    const newPortfolio = {
      userId: userData._id,
      firstName: userData.firstName ?? '',
      lastName: userData.lastName ?? '',
      headline: `${userData.firstName} ${userData.lastName}`,
      identities: userData.identities,
      overview: '',
      title: 'New Portfolio',
    };
    const { status } = await dispatch(createNewPortfolio({
      portfolio: newPortfolio,
      token,
      isLoader: false
    }));

    if (status === RESPONSE_STATUSES.CREATED) {
      notify('Portfolio was created.', {
        type: ALERT_TYPES.SUCCESS,
        duration: 3000,
      });

      await router.push(PATHS.PORTFOLIO.PORTFOLIOS);
    } else {
      notify('Portfolio was not created.', {
        type: ALERT_TYPES.ERROR,
        duration: 3000,
      });
    }
  }

  const onCopy = () => {
    navigator.clipboard.writeText(`${SEMA_APP_URL}${PATHS.PORTFOLIO.VIEW(portfolio._id)}`);
    changeIsCopied(true);
  };

  useEffect(() => {
    if(file) {
      toggleChangeAvatarModal(true);
    }
  }, [file]);

  const fileImageUrl = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return '';
  }, [file]);

  const handleSnapshotUpdate = (data) => {
    setSnapshots(snapshots.map(snapshot => {
      if(data._id === snapshot._id) {
        return data;
      }
      return snapshot;
    }))
  }

  const onAddFileError = () => {
    toggleAddAvatarModal(false);
    toggleErrorAvatarModal(true);
  }

  const onChangeFileError = () => {
    toggleChangeAvatarModal(false);
    toggleErrorAvatarModal(true);
  }

  const onChangeAvatar = (newFile, onError, close) => {
    if (!newFile || !isValidImageType(newFile.type) || ((newFile.size / BYTES_IN_MEGABYTE) >= MAXIMUM_SIZE_IN_MEGABYTES)) {
      onError();
    } else {
      close();
      setFile(newFile);
    }
  }

  const uploadAvatar = async () => {
    setUser({ ...user, avatar: fileImageUrl });
    toggleChangeAvatarModal(false);

    const formData = new FormData();
    formData.append('avatar', file);

    await dispatch(uploadPortfolioAvatar(portfolio._id, formData, token));
  };

  useEffect(() => {
    if (error.message === UPLOAD_AVATAR_ERROR_MESSAGE) {
      notify(error.message, { type: 'error'});
      setUser({ ...user, avatar: portfolio.imageUrl });
    }
  }, [error]);

  if (isLoadingScreen) {
    return <Loader />
  }

  if (!isOwner && isPrivatePortfolio && isIndividualView) {
    return <ErrorPage />
  }

  return (
    <>
      <DndProvider backend={HTML5Backend}>
      <AddModal
        isModalActive={isAddModalOpen}
        toggleModalActive={toggleAddModal}
        portfolio={portfolio}
      />
      <EditPortfolio
        isModalActive={isEditModalOpen}
        toggleModalActive={toggleEditModal}
        profileOverview={portfolio.overview}
        portfolioId={portfolio._id}
      />
      <DeleteModal
        isModalActive={isDeleteModalOpen}
        toggleModalActive={toggleDeleteModal}
        onSubmit={() => onDeletePortfolio()}
        type="portfolio"
      />
      { isAddAvatarModalOpen && <AddPortfolioAvatarModal 
        close={() => toggleAddAvatarModal(false)}
        onChange={onChangeAvatar}
        onError={onAddFileError}
      /> }
      { isChangeAvatarModalOpen && <ChangePortfolioAvatarModal
        close={() => toggleChangeAvatarModal(false)}
        image={fileImageUrl}
        onChange={onChangeAvatar}
        onSubmit={uploadAvatar}
        onError={onChangeFileError}
      /> }
      { isErrorAvatarModalOpen && <ErrorPortfolioAvatarModal
        close={() => toggleErrorAvatarModal(false)}
        onChange={onChangeAvatar}
      /> }
      <div className={clsx('mb-10', pdfView ? styles.pdfTitle : styles.title)}>
        <div className="container py-20">
          <div className="is-relative is-flex mx-10 is-justify-content-space-between">
            <TitleField
              portfolio={portfolio}
              isEditable={isOwner && !pdfView}
            />
            <div className="is-relative is-flex is-align-items-center">
              {!pdfView && isOwner && isIndividualView && <>
                <div className="is-flex is-align-items-center ml-20 pr-40" style={{ paddingTop: '3px' }}>
                  <div className="field sema-toggle switch-input m-0" onClick={onClickChild} aria-hidden>
                    <div className={clsx(styles['textContainer'])}>
                      {isPublicPortfolio ?
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
                      checked={isPublicPortfolio}
                    />
                    <label htmlFor={`activeSwitch-${portfolio._id}`} />
                  </div>
                  <div
                    className="is-flex"
                    onClick={isPublicPortfolio ? onCopy : () => { }}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                  >
                    <ShareIcon color={isPublicPortfolio ? black950 : gray600} />
                  </div>
                  <div className="is-size-4 mx-20" style={{ color: gray600 }}>|</div>
                  <button
                    onClick={() => toggleAddModal(true)}
                    type="button"
                    className="button is-transparent m-0"
                  >
                    + Add Snapshot
                  </button>
                  <button onClick={savePdf} type="button" className={clsx(styles['pdfButton'], "has-no-border has-background-white ml-10 is-clickable is-relative")}>
                    <p>Save as PDF</p>
                    <PdfIcon />
                  </button>
                  {portfolios.length === 1 &&
                    (
                      <button
                        onClick={goToAddPortfolio}
                        type="button"
                        className="button is-transparent m-0 ml-15"
                      >
                        Create another Portfolio
                      </button>
                    )
                  }
                </div>
              <div className={styles['dropdownContainer']}>
                <DropDownMenu
                  isRight
                  options={[
                    {
                      // TODO: add Duplicate - ETCR-1030
                      label: 'Duplicate Portfolio',
                      onClick: () => console.log('TODO: will be implement later'),
                    },
                    {
                      label: 'Delete',
                      onClick: () => toggleDeleteModal(true),
                      isHidden: portfolios.length === 1
                    },
                  ]}
                  trigger={
                    <div className="is-clickable is-flex">
                      <OptionsIcon />
                    </div>
                  }
                />
              </div>
              </>}
            </div>
          </div>
        </div>
      </div>
      <div className="hero-body pt-20 pb-300 mx-25">
        <div className="portfolio-content mb-30 container">
          <PortfolioGuideBanner isActive={snapshots.length === 0} />
          <div className={clsx(styles['user-summary'])}>
            <div className={clsx(styles['user-image'], 'is-clickable')} onClick={() => toggleAddAvatarModal(true)}>
              <img className={clsx('is-rounded', styles.avatar)} src={user.avatar} alt="user_icon" />
              {isOwner && <div className="is-absolute">
                <CameraIcon size="large" color={white50}/>
              </div>}
            </div>
            <div className={clsx(styles.username, 'has-background-gray-900 pl-250 has-text-white-0 is-flex is-align-items-center')}>
              <div className="is-full-width">
                <div className="has-text-weight-semibold is-size-4 is-full-width">{user.fullName}</div>
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
                  {portfolio.overview}
                </div>
                {
                  isOwner && !pdfView && (
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
          <p className="mb-5 is-size-4 has-text-weight-semibold">Snapshots</p>
          <DashboardDraggableList
            pageLayout={layout}
            updateLayout={onLayoutChange}
            handleSnapshotUpdate={handleSnapshotUpdate}
            snapshots={snapshots}
            isPdfView={pdfView}
          />
        </div>
      </div>
      </DndProvider>
    </>
  );
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
