import InteractionCircleChart from '../../chart/InteractionCircleChart';
import { DownloadIcon, FacebookIcon, LinkedinIcon, LinkIcon, TwitterIcon } from '../../Icons';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { blue700 } from '../../../../styles/_colors.module.scss';
import { getRepoSocialGraph } from '../../../state/features/repositories/api';
import styles from './repoSocialCircle.module.scss';
import { PrivateRepoBanner } from '../../repos/repoSocialCircle/banners/privateRepoBanner';
import { NotSyncedRepoBanner } from '../../repos/repoSocialCircle/banners/notSyncedRepoBanner';
import { SyncInProgressRepoBanner } from '../../repos/repoSocialCircle/banners/syncInProgressBanner';
import { shareWithTwitter, shareWithLinkedIn } from '../../../utils/socialMedia'
import { SEMA_APP_URL } from 'src/utils/constants';
import { useRouter } from 'next/router';

export const SYNC_STATUSES = {
  EMPTY: null,
  QUEUED: 'queued',
  STARTED: 'started',
  COMPLETED: 'completed',
  ERRORED: 'errored',
  UNAUTHORIZED: 'unauthorized',
}

const RepoSocialCircle = ({ repoId }) => {
  const [interactions, setInteractions] = useState([]);
  const { user } = useSelector((state) => state.authState);
  const { data: repoData, isFetching } = useSelector((state) => state.repositoriesState);
  const [repoName, setRepoName] = useState('');
  const handle = user?.identities[0]?.username;
  const { overview } = repoData;
  const syncStatus = overview?.sync?.status;

  const isRepoSynced = syncStatus === SYNC_STATUSES.COMPLETED;
  const isSyncingNow = syncStatus ===  SYNC_STATUSES.QUEUED || syncStatus === SYNC_STATUSES.STARTED;
  // TODO: add a real calculation
  const isRepoPrivate = false;

  // TODO: should be extracted to a hook or a component
  useEffect(() => {
    getRepoSocialGraph({handle, repoId})
      .then((res) => {
        setInteractions(res?.data?.interactionsByUsers);
        setRepoName(res?.data?.repoName);
      });
  }, [repoId])

  if (isFetching) return null;

  if (isRepoPrivate) {
    return <PrivateRepoBanner />
  }

  if (isSyncingNow) {
    return <SyncInProgressRepoBanner />
  }

  if (!isRepoSynced) {
    return <NotSyncedRepoBanner />
  }

  const socialCircleUrl = `${window.location.origin}/${handle}/collaboration/${repoName}?${repoId}`
  const socials = [
    { name: 'twitter', icon: TwitterIcon, onClick: () => shareWithTwitter({ text: 'Check out my Github Social Circle!', url: socialCircleUrl })},
    { name: 'facebook', icon: FacebookIcon, onClick: () => {}},
    { name: 'linkedin', icon: LinkedinIcon, onClick: () => {}},
  ]

  // TODO: mobile styles
  return (
    <div className={clsx(styles.card, 'is-flex is-justify-content-space-between')}>
      <div className={styles.main}>
        <h3 className={styles.title}>Here’s your GitHub Social Circle</h3>
        <h6 className={styles.subtitle}>{handle} for {repoName}</h6>
        <div className={styles.text}>
          <p>
            Larger, closer circles are your tight-knit team, who you worked with the most over the last year. Smaller, distant circles are team members you don’t spend as much time working with.
          </p>
          <p className="mt-24">
            Surprised by who your closest collaborators are? <br/>
            Want to work more closely with those in your outer cirlce? <br/>
            Let them know by sharing and tagging them <br/>
            on your favorite social network.
          </p>
        </div>
        <div className="pr-30">
          <span className="is-size-4 has-text-weight-semibold">Share:</span>
          <div className="mt-16 is-flex is-justify-content-center">
              {socials.map(({onClick, icon}) => (
                <div className='is-flex mr-16 is-clickable' onClick={onClick}>
                  {icon({color: blue700, size:"large"})}
                </div>
              ))}
          </div>
          <div className="mt-32">
            <button className="button is-primary mr-12">
              <DownloadIcon size="small" />
              {/* TODO: save as a picture */}
              <span className="ml-8 has-text-weight-semibold">Download</span>
            </button>
            <button className="button is-primary is-outlined">
              <LinkIcon size="small"/>
              {/* TODO: copy sharable link */}
              <span className="ml-8 has-text-weight-semibold">Copy Link</span>
            </button>
          </div>
        </div>
      </div>
      <div style={{width: '100%', minWidth: '700px', display: 'flex', position: 'relative'}}>
        <InteractionCircleChart interactions={interactions} user={user} />
      </div>
    </div>

  )
}

export default RepoSocialCircle;
