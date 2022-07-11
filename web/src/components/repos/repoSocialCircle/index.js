import InteractionCircleChart from '../../chart/InteractionCircleChart';
import { DownloadIcon, FacebookIcon, InstagramIcon, LinkedinIcon, LinkIcon, TwitterIcon } from '../../Icons';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { blue700 } from '../../../../styles/_colors.module.scss';
import { getRepoSocialGraph } from '../../../state/features/repositories/api';
import styles from './repoSocialCircle.module.scss';
import { PrivateRepoBanner } from '../../repos/repoSocialCircle/banners/privateRepoBanner';
import { NotSyncedRepoBanner } from '../../repos/repoSocialCircle/banners/notSyncedRepoBanner';
import { SyncInProgressRepoBanner } from '../../repos/repoSocialCircle/banners/syncInProgressBanner';

const RepoSocialCircle = ({ repoId }) => {
  const [interactions, setInteractions] = useState([]);
  const { user } = useSelector((state) => state.authState);
  const { data: { repositories } } = useSelector((state) => state.repositoriesState);
  const repoName = repositories.find((repo) => repo.id === repoId)?.fullName;
  const handle = user?.identities[0]?.username;
  // TODO: add a real calculation
  const isRepoSynced = true;
  // TODO: add a real calculation
  const isRepoPrivate = false;
  // TODO: add a real calculation
  const isSyncingNow = false;

  // TODO: should be extracted to a hook or a component
  useEffect(() => {
    getRepoSocialGraph({handle, repoId})
      .then((res) => {
        setInteractions(res?.data?.interactionsByUsers)
      });
  }, [repoId])

  if (isRepoPrivate) {
    return <PrivateRepoBanner />
  }

  if (isSyncingNow) {
    return <SyncInProgressRepoBanner />
  }

  if (!isRepoSynced) {
    return <NotSyncedRepoBanner />
  }
  const socialIcons = [TwitterIcon, InstagramIcon, FacebookIcon, LinkedinIcon];

  // TODO: mobile styles
  return (
    <div className={clsx(styles.card, 'is-flex is-justify-content-space-between')}>
      <div style={{minWidth: '500px'}} className="has-text-centered px-24">
        <h3 className={styles.title}>Your GitHub Social Circle</h3>
        <h6 className={styles.subtitle}>{handle} for {repoName}</h6>
        <div className={styles.text}>
          <p>
            Your GitHub Social Circle is a representation of who you’ve been collaborating with most in this repo over the last year.
          </p>
          <p className="mt-24">
            Larger, closer circles to your avatar indicate more collaboration, while smaller, more distant circles indicate less interactions.
          </p>
        </div>
        <div className={styles.buttons}>
          <span className="is-size-4 has-text-weight-semibold">Share:</span>
          <div className="mt-16 is-flex is-justify-content-center">
              {socialIcons.map(icon => (
                <div className='is-flex mr-16'>
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
      <div style={{width: '100%', display: 'flex', position: 'relative'}}>
        <InteractionCircleChart interactions={interactions} user={user} />
      </div>
    </div>

  )
}

export default RepoSocialCircle;
