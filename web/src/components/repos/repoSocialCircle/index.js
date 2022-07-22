import InteractionCircleChart from '../../chart/InteractionCircleChart';
import { DownloadIcon, FacebookIcon, LinkedinIcon, LinkIcon, TwitterIcon } from '../../Icons';
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { blue700 } from '../../../../styles/_colors.module.scss';
import { getRepoSocialGraph } from '../../../state/features/repositories/api';
import styles from './repoSocialCircle.module.scss';
import { PrivateRepoBanner } from '../../repos/repoSocialCircle/banners/privateRepoBanner';
import { NotSyncedRepoBanner } from '../../repos/repoSocialCircle/banners/notSyncedRepoBanner';
import { SyncInProgressRepoBanner } from '../../repos/repoSocialCircle/banners/syncInProgressBanner';
import { createDataUrl, onDownloadImage } from '../../../utils/imageHelpers';
import { uploadInfographicsImage } from '../../../state/features/auth/api';
import { isEmpty } from 'lodash';
import { shareWithFacebook, shareWithLinkedIn, shareWithTwitter } from '../../../utils/socialMedia';

export const SYNC_STATUSES = {
  EMPTY: null,
  QUEUED: 'queued',
  STARTED: 'started',
  COMPLETED: 'completed',
  ERRORED: 'errored',
  UNAUTHORIZED: 'unauthorized',
}

const RepoSocialCircle = ({ repoId }) => {
  const containerRef = useRef(null);
  const [interactions, setInteractions] = useState([]);
  const { user, token } = useSelector((state) => state.authState);
  const { data: repoData, isFetching } = useSelector((state) => state.repositoriesState);
  const [repoName, setRepoName] = useState('');
  const handle = user?.identities[0]?.username;
  const { overview } = repoData;
  const syncStatus = overview?.sync?.status;

  const isRepoSynced = syncStatus === SYNC_STATUSES.COMPLETED;
  const isSyncingNow = syncStatus ===  SYNC_STATUSES.QUEUED || syncStatus === SYNC_STATUSES.STARTED;
  // TODO: add a real calculation
  const isRepoPrivate = false;

  const [isCopied, changeIsCopied] = useState(false);

  useEffect(() => {
    getRepoSocialGraph({ handle, repoId })
      .then((res) => {
        setInteractions(res?.data?.interactionsByUsers);
        setRepoName(res?.data?.repoName);
      });
  }, [repoId]);


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
    },
  ];

  const socials = [
    { name: 'twitter', icon: TwitterIcon, onClick: () => shareWithTwitter({ text: 'Check out my Github Social Circle!', url: socialCircleUrl })},
    { name: 'facebook', icon: FacebookIcon, onClick: () => shareWithFacebook({url: socialCircleUrl})},
    {
      name: 'linkedin',
      icon: LinkedinIcon,
      onClick: () => shareWithLinkedIn({
        text: 'Check out my Github Social Circle!',
        url: socialCircleUrl,
      }),
    },
  ]

  const onCopy = () => {
    navigator.clipboard.writeText(socialCircleUrl);
    changeIsCopied(true);
    setTimeout(() => changeIsCopied(false), 3000);
  };

  if (isRepoPrivate) {
    return <PrivateRepoBanner />
  }

  if (isSyncingNow) {
    return <SyncInProgressRepoBanner />
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
        <img src='/img/illustration_screen.png' className={styles.image} alt="bg-screen"/>
        <div className={clsx('pr-30', styles.socials)}>
          <span className={styles['socials-title']}>Share your Circle</span>
          <div className="mt-16 is-flex is-justify-content-center">
            {actions.map(({
              onClick,
              icon,
            }) => (
              <div className={clsx('is-flex mr-16 is-clickable', styles['social-item'])} onClick={onClick}>
                {icon({
                  color: blue700,
                  size: 'medium',
                })}
              </div>
            ))}
            <div className={styles.divider} />
            {socials.map(({
              onClick,
              icon,
            }) => (
              <div className={clsx('is-flex mr-16 is-clickable', styles['social-item'])} onClick={onClick}>
                {icon({
                  color: blue700,
                  size: 'medium',
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div ref={containerRef} className={styles['graph-wrapper']}>
        <InteractionCircleChart interactions={interactions} user={user} />
      </div>
    </div>

  )
}

export default RepoSocialCircle;
