import React, { useRef, useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import Avatar from 'react-avatar';
import { useSelector } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import usePermission from '../../../hooks/usePermission';
import DeleteRepoModal from "./deleteRepoModal";
import styles from './repoCard.module.scss';
import { PATHS } from '../../../utils/constants';
import OverflowTooltip from '../../Tooltip/OverflowTooltip';
import RepoSyncText from '../../repoSync/repoSyncText';
import { useFlags } from '../../launchDarkly';

const statLabels = {
  smartCodeReviews: 'Sema Code Reviews',
  smartComments: 'Sema Comments',
  smartCommenters: 'Sema Commenters',
};

function RepoCard(props) {
  const titleRef = useRef(null);
  const { repoSyncTab } = useFlags();
  const { authState: { user } } = useSelector(state => state);
  const {
    name, externalId, _id: repoId, repoStats, users = [], column = 3, isOrganizationView = false, onRemoveRepo,
    sync, idx, reposLength, selectedOrganization
  } = props;
  const { isOrganizationAdmin } = usePermission();
  const [repoStatus] = useState(sync?.status || 'notsynced');
  const [isDeleteRepoModalOpen, setDeleteRepoModalOpen] = useState(false);
  const fullName = `${user.firstName} ${user.lastName}`;

  const renderStats = (label, value) => (
    <div className={clsx(
      'has-background-gray-100 border-radius-8px p-8 is-full-width is-flex is-flex-direction-column is-justify-content-center',
    )}>
      <p className="is-size-4 has-text-weight-semibold has-text-black">{value}</p>
      <p className={clsx('has-text-weight-semibold has-text-gray-700 is-uppercase', styles['stat-title'])}>{label}</p>
    </div>
  );

  const removeRepo = async (e) => {
    e.stopPropagation();
    await onRemoveRepo(repoId);
    setDeleteRepoModalOpen(false);
  };

  const hasSelectedOrganization = () => Object.getOwnPropertyDescriptor(selectedOrganization, 'organization');

  const renderUserName = () => hasSelectedOrganization() ? selectedOrganization.organization?.name : fullName;

  const renderAvatar = () => hasSelectedOrganization() ? selectedOrganization.organization?.avatarUrl : user.avatarUrl;

  return (
  <>
    <ReactTooltip html place="top" type="dark" effect="float"/>
    <Link href={`${PATHS.REPO}/${externalId}`}>
      <div
        className={clsx('p-10 is-flex is-clickable', column === 3 && styles['card-width-3c'], column === 2 && styles['card-width-2c'])}
        aria-hidden
        style={{zIndex: reposLength - idx}}
      >
        <div className={clsx('box has-background-white is-full-width p-0 border-radius-8px is-flex is-flex-direction-column', styles['card-wrapper'])}>
          <div className={clsx("is-flex is-justify-content-space-between is-align-items-center px-16", styles[repoStatus], styles['repo-card-header'])}>
            <div className='is-flex is-justify-content-space-between is-full-width'>
              <div className={`${styles['tooltip-wrapper']} is-flex`}>
                <OverflowTooltip ref={titleRef} text={name}>
                  <p ref={titleRef} className={clsx('has-text-black-900 has-text-weight-semibold is-size-5 pr-10', styles.title)}>{name}</p>
                </OverflowTooltip>
              </div>
              {repoSyncTab && <RepoSyncText repoStatus={repoStatus} isCardView />}
            </div>
          </div>
          <div className="is-flex-grow-1 is-flex is-flex-direction-column is-justify-content-space-between">
            <div className="px-12 is-flex is-justify-content-space-between is-flex-wrap-wrap">
              {Object.keys(statLabels).map((item, i) => (
                <div className={clsx('my-12 is-flex', styles.stat)} key={i}>
                  {renderStats(statLabels[item], repoStats?.[item])}
                </div>
              ))}
            </div>
          </div>
          <div className='mx-12 py-10 is-flex is-align-items-center'>
            <Avatar
              name={renderUserName()}
              src={renderAvatar()}
              size="20" 
              textSizeRatio={2.5}
              maxInitials={2}
              round
            />
            <span className='is-size-8 ml-8 has-text-black'>{renderUserName()}</span>
          </div>
        </div>
        {isOrganizationAdmin() && (
          <DeleteRepoModal
            isOpen={isDeleteRepoModalOpen}
            onCancel={() => setDeleteRepoModalOpen(false)}
            onConfirm={removeRepo}
          />
        )}
      </div>
    </Link>
  </>
  );
}

// Repos model isn't currently updated in RepoType
// RepoCard.propTypes = RepoType;

export default RepoCard;
