import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { find } from 'lodash';
import { useRouter } from 'next/router';
import clsx from "clsx";
import Sidebar from "../../sidebar";
import withLayout from "../../layout";
import styles from "./repoPageLayout.module.scss";
import { repositoriesOperations } from "../../../state/features/repositories";
import Select, { components } from 'react-select';


const { getUserRepositories } = repositoriesOperations;

const RepoPageLayout = ({ children, ...sidebarProps }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { auth, repositories } = useSelector((state) => ({
    auth: state.authState,
    repositories: state.repositoriesState,
  }));
  const { data: { overview } } = repositories;
  const { query: { repoId = '' },  pathname = '' } = router;
  const { token } = auth;
  const [selectedRepo, setSelectedRepo] = useState({}); 
  const [repoOptions, setRepoOptions] = useState([]); 

  const getUserRepos = async (user) => {
    const { identities } = user;
    const githubUser = identities?.[0];
    await dispatch(getUserRepositories(githubUser?.repositories, token));
  };

  useEffect(() => {
    getUserRepos(auth.user);
  }, [auth]);

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

  const Control = (props) => {
    return <components.Control
      {...props}
      className={clsx("has-background-white has-text-weight-semibold has-text-primary is-size-3 is-size-5-mobile p-0", styles['select-container'])}
    />
  }

  const IndicatorSeparator = () => null;

  const onChangeSelect = (obj) => {
    setSelectedRepo(obj);
    window.location = pathname.replace('[repoId]', obj.value);
  }

  return (
    <div className="has-background-white pb-250">
      <div className={clsx("mt-10 pl-50", styles['repo-select-container'])}>
        <Select 
          onChange={onChangeSelect}
          value={selectedRepo}
          options={repoOptions}
          className="pl-30"
          components={{ Control, IndicatorSeparator }}
          isOptionDisabled={(option) => option.disabled}
          placeholder={''} />
      </div>
      <div className={clsx(styles["card-container"], 'px-20')}>
        <div className="hero">
          <div className="hero-body columns m-0">
            <div className={clsx("column mx-20 m-5 border-radius-4px", styles["card"])}>
              <div className={clsx("is-size-7", styles['card-title'])}>SMART CODE REVIEWS</div>
              <div className={clsx("is-size-3 has-text-weight-semibold has-text-deep-black", styles['card-subtitle'])}>{overview?.stats?.totalPullRequests || 0}</div>
            </div>
            <div className={clsx("column mx-20 m-5 border-radius-4px", styles["card"])}>
              <div className={clsx("is-size-7", styles['card-title'])}>SMART COMMENTS</div>
              <div className={clsx("is-size-3 has-text-weight-semibold has-text-deep-black", styles['card-subtitle'])}>{overview?.stats?.totalSmartComments || 0}</div>
            </div>
            <div className={clsx("column mx-20 m-5 border-radius-4px", styles["card"])}>
              <div className={clsx("is-size-7", styles['card-title'])}>SMART COMMENTERS</div>
              <div className={clsx('is-size-3 has-text-weight-semibold has-text-deep-black', styles['card-subtitle'])}>{overview?.stats?.totalSmartCommenters|| 0}</div>
            </div>
            <div className={clsx("column mx-20 m-5 border-radius-4px", styles["card"])}>
              <div className={clsx("is-size-7", styles['card-title'])}>SEMA USERS</div>
              <div className={clsx("is-size-3 has-text-weight-semibold has-text-deep-black", styles['card-subtitle'])}>{overview?.stats?.totalSemaUsers || 0}</div>
            </div>
            </div>
          </div>
      </div>
      <Sidebar {...sidebarProps}>
        <>
          {children}
        </>
      </Sidebar>
    </div>
  );
};

export default withLayout(RepoPageLayout);
