import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { find } from "lodash";
import { useRouter } from 'next/router';
import clsx from "clsx";
import ContactUs from '../../contactUs';
import Sidebar from "../../sidebar";
import SupportForm from "../../supportForm";
import withLayout from "../../layout";
import styles from "./repoPageLayout.module.scss";
import { repositoriesOperations } from "../../../state/features/repositories";
import Select, { components } from 'react-select';


const { getUserRepositories } = repositoriesOperations;

const RepoPageLayout = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { auth, repositories } = useSelector((state) => ({
    auth: state.authState,
    repositories: state.repositoriesState,
  }));
  const { query: { repoId }, pathName } = router;
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

  useEffect(() => {
    const selectedRepo = find(repositories.data.repositories, { externalId: repoId });
    if (selectedRepo) {
      setSelectedRepo({
        label: selectedRepo.name,
        value: selectedRepo.externalId
      });
    }
    
  }, [repositories]);

  const formatOptions = (repositories) => {
    if (repositories) {
      return repositories.map((repository) => {
        return { label: repository.name, value: repository.id, disabled: !repository.externalId }
      });
    }
    return [];
  };

  const Control = (props) => {
    return <components.Control
      {...props}
      className={clsx("has-background-white has-text-weight-semibold has-text-primary is-size-3 is-size-5-mobile p-0", styles['select-container'])}
    />
  }

  const IndicatorSeparator = () => null;

  const onChangeSelect = (obj) => {
    setSelectedRepo(obj);
    window.location = pathName.replace('[repoId]', obj.value);
  }

  return (
    <div className="has-background-white">
      <SupportForm active={supportForm} closeForm={closeSupportForm} />
      <div className={clsx("mt-10", styles['repo-select-container'])}>
        <Select 
          onChange={onChangeSelect}
          value={selectedRepo}
          options={formatOptions(repositories.data?.repositories)}
          className="px-50"
          components={{ Control, IndicatorSeparator }}
          isOptionDisabled={(option) => option.disabled}
          placeholder={''} />
      </div>
      <div className={styles["card-container"]}>
        <div className="hero">
          <div className="hero-body columns">
            <div className={clsx("column mx-20 m-5 p-20", styles["card"])}>
              <div className="is-size-6">SMART CODE REVIEWS</div>
              <div className="is-size-3 has-text-weight-semibold">23</div>
            </div>
            <div className={clsx("column mx-20 m-5", styles["card"])}>
              <div className="is-size-6">SMART CODE</div>
              <div className="is-size-3 has-text-weight-semibold">23</div>
            </div>
            <div className={clsx("column mx-20 m-5", styles["card"])}>
              <div className="is-size-6">SMART COMMENTERS</div>
              <div className="is-size-3 has-text-weight-semibold">23</div>
            </div>
            <div className={clsx("column mx-20 m-5", styles["card"])}>
              <div className="is-size-6">SEMA USERS</div>
              <div className="is-size-3 has-text-weight-semibold">23</div>
            </div>
            </div>
          </div>
      </div>
      <Sidebar>{children}</Sidebar>
      <ContactUs userVoiceToken={userVoiceToken} openSupportForm={openSupportForm}/>
    </div>
  );
};

export default withLayout(RepoPageLayout);
