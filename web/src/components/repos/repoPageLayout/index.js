import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { find, isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import ReactTooltip from 'react-tooltip';
import Sidebar from '../../sidebar';
import withLayout from '../../layout';
import Loader from '../../Loader';
import styles from './repoPageLayout.module.scss';
import { repositoriesOperations } from '../../../state/features/repositories';
import HoverSelect from '../../select/hoverSelect';
import useAuthEffect from '../../../hooks/useAuthEffect';
import RepoSyncButton from '../../repoSync/repoSyncButton';
import { useFlags } from '../../launchDarkly';
import { REPO_VISIBILITY } from '../../../utils/constants';

const { getUserRepositories, fetchReposByIds } = repositoriesOperations;

function RepoPageLayout({
  children,
  dates,
  isOrganizationRepo,
  refresh,
  isLoading,
  ...sidebarProps
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { repoSyncTab } = useFlags();
  const { auth, repositories, organizations } = useSelector((state) => ({
    auth: state.authState,
    repositories: state.repositoriesState,
    organizations: state.organizationsState,
  }));
  const {
    data: { overview = {} },
  } = repositories;
  const { name = '', fullName = null, smartcomments = [], visibility } = overview;
  const {
    query: { repoId = '' },
    pathname = '',
  } = router;
  const { token, selectedOrganization } = auth;
  const [selectedRepo, setSelectedRepo] = useState({});
  const [repoOptions, setRepoOptions] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);

  useAuthEffect(() => {
    if (!isOrganizationRepo) {
      const { repositories: userRepos } = auth.user.identities[0] || {};
      if (userRepos?.length && !repositories?.data?.repositories?.length) {
        dispatch(getUserRepositories(userRepos, token));
      }
    } else {
      const { repos } = selectedOrganization.organization;
      if (repos?.length) {
        const idsParamString = repos.join('-');
        dispatch(fetchReposByIds(idsParamString, token));
      }
    }
  }, [isOrganizationRepo]);

  useEffect(() => {
    if (smartcomments) {
      setInitialLoading(false);
    }
  }, [smartcomments]);

  const repoList = isEmpty(selectedOrganization)
    ? repositories.data?.repositories
    : organizations?.repos;

  const formatOptions = useCallback(() => {
    if (repoList) {
      setRepoOptions(
        repoList.map((repository) => ({
          label: repository.fullName || repository.name,
          value: repository.externalId,
          disabled: !repository.externalId,
        }))
      );
    }
  }, [repoList]);

  useEffect(() => {
    formatOptions(repoList);
  }, [formatOptions, repoList]);

  useEffect(() => {
    const selected = find(repoList, { externalId: repoId });
    if (selected) {
      setSelectedRepo({
        label: selected.fullName || selected.name,
        value: selected.externalId,
      });
    }
  }, [repoList, repoId]);

  const onChangeSelect = (obj) => {
    setSelectedRepo(obj);
    router.push(pathname.replace('[repoId]', obj.value));
  };

  return (
    <>
      <ReactTooltip type="dark" effect="solid" />
      <div className="has-background-white">
        {(auth.isFetching || repositories.isFetching) && initialLoading ? (
          <div
            className="is-flex is-align-items-center is-justify-content-center"
            style={{ height: '55vh' }}
          >
            <Loader />
          </div>
        ) : (
          <>
            <div className={clsx(
              "is-flex is-align-items-center container pt-25 is-flex-wrap-wrap",
              visibility === REPO_VISIBILITY.PUBLIC && 'is-justify-content-space-between' 
            )}>
              <div className={clsx("is-flex-grow-1", visibility === REPO_VISIBILITY.PRIVATE && styles['select-container'])}>
                {repoOptions.length > 1 ? (
                  <HoverSelect
                    onChange={onChangeSelect}
                    value={selectedRepo}
                    options={repoOptions}
                    className="pl-8"
                    openOnMouseOver
                    placeholder=""
                  />
                ) : (
                  <p
                    className={clsx(
                      'has-text-black-950 px-20 pt-20 has-background-white has-text-weight-semibold is-size-3 is-size-5-mobile',
                      styles['select-container'],
                      styles['repo-select-container']
                    )}
                  >
                    {fullName || name}
                  </p>
                )}
              </div>
              {!isLoading && visibility === REPO_VISIBILITY.PRIVATE && 
                <div className='is-flex is-align-items-center'>
                  <div className={clsx('border-radius-4px has-background-gray-300 px-16 py-8')}>
                    <span className='has-text-gray-700 has-text-weight-semibold'>Private</span>
                  </div>
                  <p className='has-text-gray-700 ml-16'>Only public repos can be synced with Sema for now. Private repo sync is coming soon!</p>
                </div>
              }

              {/* GH Sync actions will only be shown for public repos -for the time being- */}
              {repoSyncTab && visibility === REPO_VISIBILITY.PUBLIC && (
                <div>
                  <RepoSyncButton refresh={refresh} />
                </div>
              )}
            </div>
            <div className="container mt-10">
              <Sidebar {...sidebarProps} />
            </div>
            <div className="has-background-gray-200 pt-20">
              <div className="pb-50 container px-20">
                <div>{children}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default withLayout(RepoPageLayout);
