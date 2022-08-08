import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { REPO_VISIBILITY } from '../../../utils/constants';
import InteractionCircleChart from '../../chart/InteractionCircleChart';
import { DownloadIcon, LinkedinIcon, LinkIcon, TwitterIcon } from '../../Icons';
import { blue700 } from '../../../../styles/_colors.module.scss';
import { getRepoSocialGraph } from '../../../state/features/repositories/api';
import styles from './repoSocialCircle.module.scss';
import { PrivateRepoBanner } from "./banners/privateRepoBanner";
import { NotSyncedRepoBanner } from "./banners/notSyncedRepoBanner";
import { SyncInProgressRepoBanner } from "./banners/syncInProgressBanner";
import { createDataUrl, onDownloadImage } from '../../../utils/imageHelpers';
import { uploadInfographicsImage } from '../../../state/features/auth/api';
import { shareWithLinkedIn, shareWithTwitter } from '../../../utils/socialMedia';
import Tooltip from "../../Tooltip";

export const SYNC_STATUSES = {
  EMPTY: null,
  QUEUED: 'queued',
  STARTED: 'started',
  COMPLETED: 'completed',
  ERRORED: 'errored',
  UNAUTHORIZED: 'unauthorized',
}
const REPO_UPDATE_INTERVAL = 30 * 1000;

function RepoSocialCircle({ repoId, isLoading }) {
  const containerRef = useRef(null);
  const [interactions, setInteractions] = useState([]);
  const { user, token } = useSelector((state) => state.authState);
  const { data: repoData } = useSelector((state) => state.repositoriesState);
  const [repoName, setRepoName] = useState('');
  const handle = user?.identities[0]?.username;
  const { overview } = repoData;
  const syncStatus = overview?.sync?.status;
  const syncProgress = overview?.sync?.progress;
  const isRepoPrivate = overview?.visibility === REPO_VISIBILITY.PRIVATE;

  const isRepoSynced = syncStatus === SYNC_STATUSES.COMPLETED;
  const isSyncingNow = syncStatus ===  SYNC_STATUSES.QUEUED || syncStatus === SYNC_STATUSES.STARTED || isLoading;

  const [isCopied, changeIsCopied] = useState(false);


  useEffect(() => {
    let isMounted = true;
    const getInteractions = async () => {
      try {
        const { data } = await getRepoSocialGraph({ handle, repoId })
        if (!isMounted || !data) {
          return;
        }
        setInteractions(data.interactionsByUsers);
        setRepoName(data.repoName);
      } catch {
        setTimeout(getInteractions, REPO_UPDATE_INTERVAL);
      }
      if (isSyncingNow) {
        setTimeout(getInteractions, REPO_UPDATE_INTERVAL);
      }
    }
    getInteractions();

    return () => isMounted = false;
  }, [repoId, isSyncingNow]);


  useEffect(() => {
    if (!isEmpty(interactions) && !isEmpty(containerRef.current)) {
      createDataUrl(containerRef).then(dataUrl => {
        const formData = new FormData();
        formData.append('previewImgLink', dataUrl);
        uploadInfographicsImage({ userId: user?._id, repoId }, formData, token);
      });
    }
  }, [interactions, containerRef.current]);


  const socialCircleUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${handle}/collaboration/${repoId}?repo=${repoName}`
  const actions = [
    {
      name: 'download',
      icon: DownloadIcon,
      onClick: () => onDownloadImage(containerRef),
    },
    {
      name: 'copy',
      icon: LinkIcon,
      onClick: () => onCopy(),
      withTooltip: true,
      tooltipText: 'Copied'
    },
  ];

  const socials = [
    { name: 'twitter', icon: TwitterIcon, onClick: () => shareWithTwitter({ text: 'Check out my Github Social Circle!', url: socialCircleUrl })},
    // ToDo: return this code when facebook sharing will be fixed
    // { name: 'facebook', icon: FacebookIcon, onClick: () => shareWithFacebook({ url: socialCircleUrl })},
    { name: 'linkedin', icon: LinkedinIcon, onClick: () => shareWithLinkedIn({ url: socialCircleUrl })},
  ];

  const onCopy = () => {
    navigator.clipboard.writeText(socialCircleUrl);
    changeIsCopied(true);
    setTimeout(() => changeIsCopied(false), 3000);
  };

  const renderIcons = (iconsArray) => iconsArray.map(({
    onClick,
    icon,
    withTooltip,
    tooltipText,
  }) => (
    <div className={clsx('is-flex mr-16 is-clickable', styles['social-item'])} onClick={onClick}>
      {withTooltip ? (
        <Tooltip text={tooltipText} isActive={isCopied} hideDelay={2000}>
          {icon({
            color: blue700,
            size: 'medium',
          })}
        </Tooltip>
      ) : (
        icon({
          color: blue700,
          size: 'medium',
        }))
      }
    </div>
  ));

  if (isRepoPrivate) {
    return <PrivateRepoBanner />
  }

  if (!isRepoSynced) {
    return <NotSyncedRepoBanner />
  }

  // TODO: mobile styles
  return (
    <div className={clsx(styles.card, 'is-flex is-justify-content-space-between')}>
      <div className={styles.main}>
        <h3 className={styles.title}>GitHub Social Circle</h3>
        <h6 className={styles.subtitle}>{handle} for {repoName}</h6>
        <div className={styles.text}>
          <p>
            Larger circles toward the center represent your closest collaborators. You have worked with them most over the last 12 months. Smaller
            circles toward the outer edge are collaborators you haven’t interacted with as much.
          </p>
          <p className="mt-24">
            Surprised by who your closest collaborators are? Want to work more closely with those in your outer circle? Let them know by sharing and
            tagging them on your social network.
          </p>
        </div>
        <img src="/img/illustration.png" className={styles.image} alt="bg-screen"/>
        {isRepoSynced && (
          <div className={clsx('pr-30', styles.socials)}>
            <span className={styles['socials-title']}>Share your Circle</span>
            <div className="mt-16 is-flex is-justify-content-center">
              {renderIcons(actions)}
              <div className={styles.divider} />
              {renderIcons(socials)}
            </div>
          </div>
        )}
      </div>
      <div className='is-flex is-flex-direction-column' style={{width: '100%'}}>
        {isSyncingNow && (
          <div className={styles['circle-banner']}>
            Generating your GitHub Social Circle. Check it out when your repo data finishes syncing.
          </div>
        )}
        <div ref={containerRef}>
          <InteractionCircleChart progress={syncProgress} interactions={interactions} user={user} />
        </div>
      </div>
    </div>

  )
}

export default RepoSocialCircle;
