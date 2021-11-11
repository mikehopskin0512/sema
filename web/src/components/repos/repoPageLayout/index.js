import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isWithinInterval } from 'date-fns';
import { find, uniqBy } from 'lodash';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import Sidebar from '../../sidebar';
import withLayout from '../../layout';
import Loader from '../../Loader';
import styles from './repoPageLayout.module.scss';
import { repositoriesOperations } from '../../../state/features/repositories';
import HoverSelect from '../../../components/select/hoverSelect';
import StatCard from './components/StatCard'

const { getUserRepositories } = repositoriesOperations;

const RepoPageLayout = ({ children, dates, ...sidebarProps }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { auth, repositories } = useSelector((state) => ({
    auth: state.authState,
    repositories: state.repositoriesState,
  }));
  const { data: { overview = {} } } = repositories;
  const { name = '', smartcomments = [], users = [] } = overview;
  const { query: { repoId = '' }, pathname = '' } = router;
  const { token } = auth;
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
    const totalSemaUsers = users.length || 0;
    return [
      { title: 'smart code reviews', value: totalPullRequests, tooltip: 'Smart code review is a pull request that is reviewed uses Sema product'},
      { title: 'smart comments', value: totalSmartComments, tooltip: 'Smart Comment is a part of Smart Code Review'},
      { title: 'smart commenters', value: totalSmartCommenters, tooltip: 'Smart commenter is a reviewer that uses Sema'},
      { title: 'sema users', value: totalSemaUsers, tooltip: 'Sema user is a code reviewer who uses Sema, or a code author that has a Sema account'},
    ]
  }, [overview]);

  const getUserRepos = async (user) => {
    const { identities } = user;
    const githubUser = identities?.[0];
    await dispatch(getUserRepositories(githubUser?.repositories, token));
  };

  useEffect(() => {
    getUserRepos(auth.user);
  }, [auth]);

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
    if (repositories && repositories.data && repositories.data.repositories) {
      const selected = find(repositories.data.repositories, { externalId: repoId });
      formatOptions(repositories.data.repositories);
      if (selected) {
        setSelectedRepo({
          label: selected.name,
          value: selected.externalId,
        });
      }
    }
  }, [repositories]);

  const IndicatorSeparator = () => null;

  const onChangeSelect = (obj) => {
    setSelectedRepo(obj);
    window.location = pathname.replace('[repoId]', obj.value);
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
            <div
              className="is-flex is-justify-content-space-between is-align-items-center container pt-25 is-flex-wrap-wrap">
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
                    className={clsx('has-text-deep-black px-20 pt-20 has-background-white has-text-weight-semibold is-size-3 is-size-5-mobile', styles['select-container'], styles['repo-select-container'])}>{name}</p>
                )}
              </div>
            </div>
            <div className={clsx(styles['card-container'], 'px-20')}>
              <div className="container">
                <div className="mt-40 pb-10 columns m-0">
                  {reposStats.map(({ title, value, tooltip }) => (
                    <StatCard
                      title={title}
                      value={value}
                      tooltip={tooltip}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="has-background-gray-4">
              <Sidebar {...sidebarProps}>
                <>
                  {children}
                </>
              </Sidebar>
            </div>
          </>
        )
      }
    </div>
  );
};

export default withLayout(RepoPageLayout);
