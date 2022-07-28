import clsx from 'clsx';
import { isEmpty } from 'lodash';
import React, { useRef } from 'react';
import Avatar from 'react-avatar';
import useOutsideClick from '../../../utils/useOutsideClick';
import { SYNC_STATUS } from '../../../utils/constants';
import { red500 } from '../../../../styles/_colors.module.scss'
import { AlertOutlineIcon, ArrowDropdownIcon, ArrowDropupIcon, AuthorIcon, SemaInverseIcon } from '../../Icons';
import styles from '../header.module.scss';

function OrgSwitcher({
  organizations,
  selectedOrganization,
  isAllOrgsSelected,
  userData,
  repositories,
  openOrgSwitcher,
  setOpenOrgSwitcher,
  orgIndex,
  handleOnOrganizationClick,
  toggleOrgSwitcherItemsHoverColor,
}) {
  const orgMenu = useRef(null);

  const renderNameOrClass = (className = false) => {
    switch (true) {
      case isAllOrgsSelected:
        return className ? 'org-colour-allorgs' : 'All Organizations'
      case !isAllOrgsSelected && isEmpty(selectedOrganization):
        return className ? 'org-colour-personal' : `${userData.firstName} ${userData.lastName}`
      case !isAllOrgsSelected && !isEmpty(selectedOrganization):
        return className ? `org-colour-${orgIndex % 15}` :selectedOrganization.organization.name
      default:
        break;
    }
  }

  const renderAvatar = () =>
    isEmpty(selectedOrganization)
      ? userData.avatarUrl
      : selectedOrganization.organization.avatarUrl;

  const hasReposWithSyncErrors = (repos) => {
    const orgRepos = repos.map((repo) => repositories.data.repositories.find((item) => item._id === repo ))
    const hasRepoWithErrors = orgRepos.some((repo) => repo?.sync?.status === SYNC_STATUS.errored.status)
    return hasRepoWithErrors;
  }

  useOutsideClick(orgMenu, () => setOpenOrgSwitcher(openOrgSwitcher && false));
  
  return (
    <div
      className={clsx(
        'border-radius-4px is-flex is-justify-content-space-around is-align-items-center mr-20',
        styles['external-org-switcher-container'],
        renderNameOrClass(true),
      )}
      onClick={() => setOpenOrgSwitcher((state) => !state)}
      ref={orgMenu}
    >
      <div className="is-flex is-align-items-center">
        {!isAllOrgsSelected &&
          <Avatar
            name={renderNameOrClass()}
            src={renderAvatar()}
            size="24"
            textSizeRatio={2.5}
            maxInitials={2}
            round
          />
        }
        <span
          className={clsx(
            'has-text-black-950 has-text-weight-semibold is-size-7 px-8',
            styles['selected-org-name']
          )}
        >
          {renderNameOrClass()}
        </span>
      </div>
      {openOrgSwitcher ? (
        <ArrowDropupIcon className={clsx(styles['dropdown-icon'])} />
      ) : (
        <ArrowDropdownIcon className={clsx(styles['dropdown-icon'])} />
      )}
      {openOrgSwitcher && (
        <div
          className={clsx(
            styles['internal-org-switcher-container'],
            'has-background-white border-radius-4px'
          )}
        >

          {/* All Organizations */}
          <div
            className={clsx(
              styles['org-switcher-item'],
              'is-flex is-flex-direction-column is-justify-content-center'
            )}
            onClick={() => handleOnOrganizationClick(null, true)}
            onMouseEnter={toggleOrgSwitcherItemsHoverColor}
            onMouseLeave={toggleOrgSwitcherItemsHoverColor}
          >
            <div className='is-flex is-align-items-center noHover'>
              <div className={clsx(styles.avatar,
                'ml-20 mr-10 has-background-black-900 border-radius-8px is-flex is-justify-content-center is-align-items-center')}>
                <SemaInverseIcon />
              </div>
              <div className="is-flex is-flex-direction-column">
                <p className="has-text-black-950 has-text-weight-semibold">
                  All Organizations
                </p>
                <p className="is-size-8">
                  {repositories.data.repositories.length} repos
                </p>
              </div>
            </div>
          </div>

          {/* Personal Account */}
          <div
            className={clsx(
              styles['org-switcher-item'],
              'is-flex is-flex-direction-column is-justify-content-center'
            )}
            onClick={() => handleOnOrganizationClick()}
            onMouseEnter={toggleOrgSwitcherItemsHoverColor}
            onMouseLeave={toggleOrgSwitcherItemsHoverColor}
          >
            <div className="is-flex is-align-items-center noHover">
              <div className={clsx(styles['user-bullet'], 'border-radius-8px')} />
              <div className={clsx(styles.avatar, 'mx-10')}>
                <Avatar
                  name={`${userData.firstName} ${userData.lastName}`}
                  src={userData?.avatarUrl}
                  size="42"
                  textSizeRatio={2.5}
                  maxInitials={2}
                  round
                />
              </div>
              <div className="is-flex is-flex-direction-column">
                <div className="is-flex is-align-items-center">
                  <AuthorIcon size="small" className="mr-4" />
                  <p
                    className={clsx(
                      'has-text-black-950 has-text-weight-semibold',
                      styles['user-account-name']
                    )}
                  >
                    {`${userData.firstName} ${userData.lastName}`}
                  </p>
                </div>
                <p className="is-size-8">
                  {repositories.data.repositories.length} repos
                </p>
              </div>
            </div>
          </div>

          {/* Organizations */}
          {organizations.organizations.map((org, idx) => (
            <div
              key={org._id}
              className={clsx(
                'is-flex is-flex-direction-column is-justify-content-center',
                styles['org-switcher-item']
              )}
              onClick={() => handleOnOrganizationClick(org)}
              onMouseEnter={toggleOrgSwitcherItemsHoverColor}
              onMouseLeave={toggleOrgSwitcherItemsHoverColor}
            >
              <div className="is-flex is-align-items-center noHover">
                <div
                  className={clsx(
                    styles['org-bullet'],
                    'border-radius-8px',
                    `org-colour-${idx % 15}`
                  )}
                />
                <div className={clsx(styles.avatar, 'mx-10')}>
                  <Avatar
                    name={org?.organization?.name || 'Organization'}
                    src={org?.organization?.avatarUrl}
                    size="42"
                    textSizeRatio={2.5}
                    maxInitials={3}
                    className="border-radius-8px"
                  />
                </div>
                <div className="is-flex is-flex-direction-column">
                  <p className="has-text-black-950 has-text-weight-semibold">
                    {org.organization.name}
                  </p>
                  <p className="is-size-8">
                    {org.organization.repos.length} repos
                  </p>
                </div>
                {hasReposWithSyncErrors(org.organization.repos) &&
                  <div className='is-flex is-flex-grow-1 is-justify-content-end pr-16'>
                    <AlertOutlineIcon color={red500} size='small' />
                  </div>
                }
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrgSwitcher;
