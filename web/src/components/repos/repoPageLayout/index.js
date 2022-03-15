import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isWithinInterval } from 'date-fns';
import { find, uniqBy, isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import Sidebar from '../../sidebar';
import withLayout from '../../layout';
import Loader from '../../Loader';
import styles from './repoPageLayout.module.scss';
import { repositoriesOperations } from '../../../state/features/repositories';
import HoverSelect from '../../../components/select/hoverSelect';
import useAuthEffect from '../../../hooks/useAuthEffect';

const { getUserRepositories, fetchReposByIds } = repositoriesOperations;

const RepoPageLayout = ({ children, dates, isTeamRepo, ...sidebarProps }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { auth, repositories, teams } = useSelector((state) => ({
    auth: state.authState,
    repositories: state.repositoriesState,
    teams: state.teamsState,
  }));
  const { data: { overview = {} } } = repositories;
  const { name = '', smartcomments = [], users = [] } = overview;
  const { query: { repoId = '' }, pathname = '' } = router;
  const { token, selectedTeam } = auth;
  const [selectedRepo, setSelectedRepo] = useState({});
  const [repoOptions, setRepoOptions] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);

  const reposStats = useMemo(() => {
    const smartComments = smartcomments.filter((item) => dates.startDate && dates.endDate ? isWithinInterval(new Date(item.createdAt), {
      start: new Date(dates.startDate),
      end: new Date(dates.endDate)
    }) : true);
    const totalSmartComments = smartComments.length || 0;
    const totalSmartCommenters = uniqBy(smartComments, (item) => item.userId?._id?.valueOf() || 0).length || 0;
    const totalPullRequests = uniqBy(smartComments, 'githubMetadata.pull_number').length || 0;
    const totalSemaUsers = users && users.length || 0;
    return [
      { title: 'sema code reviews', value: totalPullRequests, tooltip: 'Pull Request reviewed using Sema'},
      { title: 'sema comments', value: totalSmartComments, tooltip: 'Comment made in a Code Review using Sema'},
      { title: 'sema commenters', value: totalSmartCommenters, tooltip: 'Number of Code Reviewers using Sema'},
      { title: 'sema users', value: totalSemaUsers, tooltip: 'Number of people with a Sema account'},
    ]
  }, [overview]);

  useAuthEffect(() => {
    if (!isTeamRepo) {
      const { repositories: userRepos } = auth.user.identities[0] || {};
      if (userRepos?.length && !repositories?.data?.repositories?.length) {
        dispatch(getUserRepositories(userRepos, token));
      }
    } else {
      const { repos } = selectedTeam.team;
      if (repos?.length) {
        const idsParamString = repos.join('-');
        dispatch(fetchReposByIds(idsParamString, token));
      }
    }
  }, [isTeamRepo]);

  useEffect(() => {
    if (smartcomments) {
      setInitialLoading(false);
    }
  }, [repositories]);

  const formatOptions = (repositories) => {
    if (repositories) {
      setRepoOptions(repositories.map((repository) => {
        return { label: repository.name, value: repository.externalId, disabled: !repository.externalId };
      }));
    }
  };

  useEffect(() => {
    formatOptions(isEmpty(selectedTeam) ? repositories.data?.repositories : teams?.repos);
  }, []);

  useEffect(() => {
    const selected = find(isEmpty(selectedTeam) ? repositories.data?.repositories : teams?.repos, { externalId: repoId });
    formatOptions(isEmpty(selectedTeam) ? repositories.data?.repositories : teams?.repos);
    if (selected) {
      setSelectedRepo({
        label: selected.name,
        value: selected.externalId,
      });
    }
  }, [repositories, teams]);

  const onChangeSelect = (obj) => {
    setSelectedRepo(obj);
    router.push(pathname.replace('[repoId]', obj.value));
  };

  return (
    <div className="has-background-white">
      {
        (auth.isFetching || repositories.isFetching) && initialLoading ? (
          <div className="is-flex is-align-items-center is-justify-content-center" style={{ height: '55vh' }}>
            <Loader />
          </div>
        ) : (
          <>
            <div className="is-flex is-justify-content-space-between is-align-items-center container pt-25 is-flex-wrap-wrap">
              <div className={'is-flex-grow-1'}>
                {repoOptions.length > 1 ? (
                  <HoverSelect
                    onChange={onChangeSelect}
                    value={selectedRepo}
                    options={repoOptions}
                    className="pl-8"
                    openOnMouseOver
                    placeholder={''}
                  />
                ) : (
                  <p
                    className={clsx('has-text-black-950 px-20 pt-20 has-background-white has-text-weight-semibold is-size-3 is-size-5-mobile', styles['select-container'], styles['repo-select-container'])}>{name}</p>
                )}
              </div>
            </div>
            <div className="container mt-10">
              <Sidebar {...sidebarProps} />
            </div>
            <div className="has-background-gray-200 pt-20">
              <div className="pb-50 container px-20">
                <div>
                  {children}
                </div>
              </div>
            </div>
          </>
        )
      }
    </div>
  );
};

export default withLayout(RepoPageLayout);
