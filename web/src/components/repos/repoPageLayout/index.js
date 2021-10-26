import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { find } from 'lodash';
import { useRouter } from 'next/router';
import clsx from "clsx";
import Sidebar from "../../sidebar";
import withLayout from "../../layout";
import Loader from "../../Loader";
import styles from "./repoPageLayout.module.scss";
import { repositoriesOperations } from "../../../state/features/repositories";
import HoverSelect from '../../../components/select/hoverSelect';

const { getUserRepositories } = repositoriesOperations;

const RepoPageLayout = ({ children, ...sidebarProps }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { auth, repositories } = useSelector((state) => ({
    auth: state.authState,
    repositories: state.repositoriesState,
  }));
  const { data: { overview } } = repositories;
  const { name = '', stats = {} } = overview;
  const { totalPullRequests, totalSemaUsers, totalSmartCommenters, totalSmartComments } = stats;
  const { query: { repoId = '' },  pathname = '' } = router;
  const { token } = auth;
  const [selectedRepo, setSelectedRepo] = useState({});
  const [repoOptions, setRepoOptions] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);

  const getUserRepos = async (user) => {
    const { identities } = user;
    const githubUser = identities?.[0];
    await dispatch(getUserRepositories(githubUser?.repositories, token));
  };

  useEffect(() => {
    getUserRepos(auth.user);
  }, [auth]);

  useEffect(() => {
    if (totalPullRequests && totalSemaUsers && totalSmartCommenters && totalSmartComments) {
      setInitialLoading(false);
    }
  }, [repositories]);

  const formatOptions = (repositories) => {
    if (repositories) {
      setRepoOptions(repositories.map((repository) => {
        return { label: repository.name, value: repository.externalId, disabled: !repository.externalId }
      }))
    }
  };

  useEffect(() => {
    if(repositories && repositories.data && repositories.data.repositories ) {
      const selected = find(repositories.data.repositories, { externalId: repoId });
      formatOptions(repositories.data.repositories);
      if (selected) {
        setSelectedRepo({
          label: selected.name,
          value: selected.externalId
        });
      }
    }
  }, [repositories]);

  const IndicatorSeparator = () => null;

  const onChangeSelect = (obj) => {
    setSelectedRepo(obj);
    window.location = pathname.replace('[repoId]', obj.value);
  }

  return (
    <div className="has-background-white">
      {
        (auth.isFetching || repositories.isFetching) && initialLoading ? (
          <div className="is-flex is-align-items-center is-justify-content-center" style={{ height: '55vh' }}>
            <Loader/>
          </div>
        ) : (
          <>
            <div className="is-flex is-justify-content-space-between is-align-items-center container pt-25 is-flex-wrap-wrap">
              <div className={"is-flex-grow-1"}>
                { repoOptions.length > 1 ? (
                  <HoverSelect
                    onChange={onChangeSelect}
                    value={selectedRepo}
                    options={repoOptions}
                    className="pl-8"
                    openOnMouseOver
                    placeholder={''}
                  />
                ) : (
                  <p className={clsx("has-text-deep-black px-20 pt-20 has-background-white has-text-weight-semibold is-size-3 is-size-5-mobile", styles['select-container'], styles['repo-select-container'])}>{name}</p>
                ) }
              </div>
            </div>
            <div className={clsx(styles["card-container"], 'px-20')}>
              <div className="container">
                <div className="mt-40 pb-10 columns m-0">
                  <div className={clsx("column mx-20 m-5 border-radius-4px", styles["card"])}>
                    <div className={clsx("is-size-7", styles['card-title'])}>SMART CODE REVIEWS</div>
                    <div className={clsx("is-size-3 has-text-weight-semibold has-text-deep-black", styles['card-subtitle'])}>{totalPullRequests}</div>
                  </div>
                  <div className={clsx("column mx-20 m-5 border-radius-4px", styles["card"])}>
                    <div className={clsx("is-size-7", styles['card-title'])}>SMART COMMENTS</div>
                    <div className={clsx("is-size-3 has-text-weight-semibold has-text-deep-black", styles['card-subtitle'])}>{totalSmartComments}</div>
                  </div>
                  <div className={clsx("column mx-20 m-5 border-radius-4px", styles["card"])}>
                    <div className={clsx("is-size-7", styles['card-title'])}>SMART COMMENTERS</div>
                    <div className={clsx('is-size-3 has-text-weight-semibold has-text-deep-black', styles['card-subtitle'])}>{totalSmartCommenters}</div>
                  </div>
                  <div className={clsx("column mx-20 m-5 border-radius-4px", styles["card"])}>
                    <div className={clsx("is-size-7", styles['card-title'])}>SEMA USERS</div>
                    <div className={clsx("is-size-3 has-text-weight-semibold has-text-deep-black", styles['card-subtitle'])}>{totalSemaUsers}</div>
                  </div>
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
