import clsx from 'clsx';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InteractionCircleChart from '../../chart/InteractionCircleChart';
import { blue700 } from '../../../../styles/_colors.module.scss';
import styles from './socialCycleStyles.module.scss';
import Tooltip from '../../Tooltip';
import { CIRCLE_UPDATE_INTERVAL, CYCLE_SHARE_LINK, SOCIAL_CIRCLE_TYPES } from '../../../components/repos/socialCycle/constants';
import {
  getAllUserReposStats,
  getCorrectSocialCycleLink,
  getSocialCycleActions,
  getSocialCycleAvailability,
  getSocialCycleSyncState,
  getSocialCycleTitle,
} from '../../../components/repos/socialCycle/utils';
import { getUserRepositories } from '../../../state/features/repositories/operations';
import { PrivateRepoBanner } from '../../../components/repos/repoSocialCircle/banners/privateRepoBanner';
import { SyncInProgressRepoBanner } from '../../../components/repos/repoSocialCircle/banners/syncInProgressBanner';

function SocialCircle({ type = SOCIAL_CIRCLE_TYPES.personal }) {
  const containerRef = useRef(null);
  const dispatch = useDispatch();

  const [interactions, setInteractions] = useState([]);
  const [isCopied, changeIsCopied] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { user, token } = useSelector((state) => state.authState);
  const { data: repoData, isFetching } = useSelector((state) => state.repositoriesState);


  const username = user?.identities[0]?.username;
  const repos = repoData.repositories ?? [];
  const cycleLink = CYCLE_SHARE_LINK[type]?.(type, username, repos.map(i => i.externalId));

  const socialCycleTitle = useMemo(() => {
    return getSocialCycleTitle(type, username);
  }, [type, username]);

  const isAvailable = useMemo(() => getSocialCycleAvailability({
    type,
    repos,
  }), [type, repos]);

  const isSyncing = useMemo(() => getSocialCycleSyncState({
    type,
    repos,
  }), [type, repos]);


  const calculateCycleValues = () => {
    if (type === SOCIAL_CIRCLE_TYPES.personal) {
      getAllUserReposStats(username, repos.map(i => i.externalId))
        .then(({ interactions }) => {
          setInteractions(interactions);
          setIsInitialLoad(false);
        })
        .catch(() => {
          setInteractions([]);
          setIsInitialLoad(false);
        });
    } else {
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      calculateCycleValues();
    }, CIRCLE_UPDATE_INTERVAL);

    calculateCycleValues();

    return () => clearInterval(interval);
  }, [repos, type]);

  useEffect(() => {
    if (type === SOCIAL_CIRCLE_TYPES.personal && user) {
      const { repositories: userRepos } = user.identities[0] || {};
      if (userRepos?.length && !repoData?.repositories?.length) {
        dispatch(getUserRepositories(userRepos, token));
      }
    }
  }, [type, user])

  const onCopy = () => {
    navigator.clipboard.writeText(cycleLink);
    changeIsCopied(true);
    setTimeout(() => changeIsCopied(false), 3000);
  };

  const actions = useMemo(() => getSocialCycleActions({ onCopy, ref: containerRef, type }), [type, containerRef.current]);

  const socials = useMemo(() => getCorrectSocialCycleLink(cycleLink), [cycleLink]);

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

  if (isFetching && isInitialLoad) return null;

  if (isSyncing) return <div className="mt-20"><SyncInProgressRepoBanner /></div>;

  if (!isAvailable) return <div className="mt-20"><PrivateRepoBanner customText="Unable to generate social circle" /></div>;

  return (
    <div className={clsx(styles.card, 'is-flex is-justify-content-space-between')}>
      <div className={styles.main}>
        <h3 className={styles.title}>{socialCycleTitle}</h3>
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
        <div className={clsx('pr-30', styles.socials)}>
          <span className={styles['socials-title']}>Share your Circle</span>
          <div className="mt-16 is-flex is-justify-content-center">
            {renderIcons(actions)}
            <div className={styles.divider} />
            {renderIcons(socials)}
          </div>
        </div>
      </div>
      <div className='is-flex is-flex-direction-column' style={{width: '100%'}}>
        <div ref={containerRef}>
          <InteractionCircleChart progress={false} interactions={interactions} user={user} />
        </div>
      </div>
    </div>
  )
}

export default SocialCircle;
