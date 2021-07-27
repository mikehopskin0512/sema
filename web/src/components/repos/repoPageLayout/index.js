import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import ContactUs from '../../contactUs';
import Sidebar from "../../sidebar";
import SupportForm from "../../supportForm";
import withLayout from "../../layout";
import styles from "./repoPageLayout.module.scss";
import { repositoriesOperations } from "../../../state/features/repositories";
import Select from 'react-select';


const { getUserRepositories } = repositoriesOperations;

const RepoPageLayout = ({ children }) => {
  const dispatch = useDispatch();
  const { auth, repositories } = useSelector((state) => ({
    auth: state.authState,
    repositories: state.repositoriesState,
  }));
  const { token, user, userVoiceToken } = auth;
  const [selectedRepo, setSelectedRepo] = useState({}); 
  const [supportForm, setSupportForm] = useState(false);

  const openSupportForm = () => setSupportForm(true);
  const closeSupportForm = () => setSupportForm(false);

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
      <SupportForm active={supportForm} closeForm={closeSupportForm} />
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
      <Sidebar>{children}</Sidebar>
      <ContactUs userVoiceToken={userVoiceToken} openSupportForm={openSupportForm}/>
    </div>
  );
};

export default withLayout(RepoPageLayout);
