import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import Sidebar from "../../components/sidebar";
import withLayout from "../../components/layout";
import styles from "./activity.module.scss";
import { repositoriesOperations } from "../../state/features/repositories";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const { getUserRepositories } = repositoriesOperations;

const ActivityLogs = () => {
  const dispatch = useDispatch();
  const { auth, repositories } = useSelector((state) => ({
    auth: state.authState,
    repositories: state.repositoriesState,
  }));
  const { token, user, userVoiceToken } = auth;
  const [isDropdownOpen, toggleDropdownOpen] = useState(false);
  const [selectedRepository, setSelectedRepository] = useState({name: "Select a repository"});

  console.log(auth, repositories);

  const getUserRepos = async (user) => {
    const { identities } = user;
    const githubUser = identities?.[0];
    await dispatch(getUserRepositories(githubUser?.repositories, token));
  };

  useEffect(() => {
    getUserRepos(auth.user);
  }, [auth]);

  const handleButtonClick = (e) => {
    toggleDropdownOpen(!isDropdownOpen)
    e.stopPropagation();
  };



  return (
    <div>
      <div className={`dropdown ${isDropdownOpen && 'is-active'} pl-120 ml-20 mb-70`}>
        <div className="dropdown-trigger" >
          <div className="is-clickable mt-50" onClick={handleButtonClick}>
            <span className="is-size-5">
              {selectedRepository.name}
              <FontAwesomeIcon
                className='is-clickable ml-10'
                icon={!isDropdownOpen ? 'caret-down' : 'caret-up'}
                size="lg"
              />
            </span>
          </div>

          {/* <button className="button" aria-haspopup="true" aria-controls="dropdown-menu" onClick={handleButtonClick}>
            <span>
              {selectedRepository} 
              <FontAwesomeIcon
                className='is-clickable ml-10'
                icon={!isDropdownOpen ? 'caret-down' : 'caret-up'}
                size="lg"
              />
            </span>
          </button> */}
        </div>
        <div className="dropdown-menu" id="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {
              repositories.data?.map(repo => {
                return (<a href="#" className="dropdown-item" 
                onClick={
                  () => {
                    setSelectedRepository(repo);
                    toggleDropdownOpen(false);
                  }
                }
                >
                  {repo.name}
                </a>)
              })
            }
            {/* <a href="#" className="dropdown-item">
              Dropdown item
            </a>
            <a className="dropdown-item">
              Other dropdown item
            </a>
            <a href="#" className="dropdown-item is-active">
              Active dropdown item
            </a>
            <a href="#" className="dropdown-item">
              Other dropdown item
            </a>
            <a href="#" className="dropdown-item">
              With a divider
            </a> */}
          </div>
        </div>
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
