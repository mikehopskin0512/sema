import InteractionCircleChart from '@/components/chart/InteractionCircleChart';
import { DownloadIcon, LinkIcon } from '@/components/Icons';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getRepoSocialGraph } from '../../../state/features/repositories/api';
import styles from './repoSocialCircle.module.scss';

const RepoSocialCircle = ({ repoId }) => {
  const [interactions, setInteractions] = useState([]);
  const { token } = useSelector((state) => state.authState);

  useEffect(() => {
    getRepoSocialGraph({repoId}, token)
      .then((res) => setInteractions(res.data));
  }, [repoId, token])

  return (
    <div className={clsx(styles.card, 'is-flex is-justify-content-space-between')}>
      <div className="mr-32 has-text-centered px-24">
        <h3 className={styles.title}>Your GitHub Social Circle</h3>
        <h6 className={styles.subtitle}>Username for [Repo Name]</h6>
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
          <div className="mt-16">
            social buttons
          </div>
          <div className="mt-32">
            <button className="button is-primary mr-12">
              <DownloadIcon size="small" />
              <span className="ml-8 has-text-weight-semibold">Download</span>
            </button>
            <button className="button is-primary is-outlined">
              <LinkIcon size="small"/>
              <span className="ml-8 has-text-weight-semibold">Copy Link</span>
            </button>
          </div>
        </div>
      </div>
      <div style={{minHeight: '500px', minWidth: '700px', display: 'flex', position: 'relative'}}>
        <InteractionCircleChart interactions={interactions} />
      </div>
    </div>

  )
}

export default RepoSocialCircle;
