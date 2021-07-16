import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import Sidebar from "../../components/sidebar";
import withLayout from "../../components/layout";
import styles from "./activity.module.scss";
import { repositoriesOperations } from "../../state/features/repositories";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from 'react-select'


const { getUserRepositories } = repositoriesOperations;

const ActivityLogs = () => {
  const dispatch = useDispatch();
  const { auth, repositories } = useSelector((state) => ({
    auth: state.authState,
    repositories: state.repositoriesState,
  }));
  const { token, user, userVoiceToken } = auth;
  const [selectedRepo, setSelectedRepo] = useState({}); 
  console.log(auth, repositories);

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
      return repositories.map((repository) => {
        return { label: repository.name, value: repository.id }
      });
    }
    return [];
  };

  return (
    <div>
      <div style={{width: 400}}>
        <Select onChange={(obj) => setSelectedRepo(obj)} options={formatOptions(repositories.data?.repositories)} className="pl-120 ml-20 mb-70" placeholder={'Select a repository'} />
      </div>
      <div className={clsx("columns px-120", styles["card-container"])}>
        <div className={clsx("column mx-20 p-20", styles["card"])}>
          <div className="is-size-6">SMART CODE REVIEWS</div>
          <div className="is-size-3 has-text-weight-semibold">23</div>
        </div>
        <div className={clsx("column mx-20", styles["card"])}>
          <div className="is-size-6">SMART CODE</div>
          <div className="is-size-3 has-text-weight-semibold">23</div>
        </div>
        <div className={clsx("column mx-20", styles["card"])}>
          <div className="is-size-6">SMART COMMENTERS</div>
          <div className="is-size-3 has-text-weight-semibold">23</div>
        </div>
        <div className={clsx("column mx-20", styles["card"])}>
          <div className="is-size-6">SEMA USERS</div>
          <div className="is-size-3 has-text-weight-semibold">23</div>
        </div>
      </div>
      <Sidebar>Content</Sidebar>
    </div>
  );
};

export default withLayout(ActivityLogs);
