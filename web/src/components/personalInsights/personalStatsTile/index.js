import React from "react";
import { useSelector } from "react-redux";
import clsx from "clsx";
import styles from "./personalStatsTile.module.scss";
import { GITHUB_URL } from "src/utils/constants";

const PersonalStatsTile = ({ topTags, topReactions, totalSmartComments }) => {
  const auth = useSelector((state) => state.authState);
  const {
    user: {
      firstName,
      lastName,
      username,
      avatarUrl,
      identities
    },
  } = auth;
  // Get GitHub identity
  const { username: githubUsername } = identities.find((item) => item.provider === "github");

  const renderTopReactions = () => {
    return topReactions.map((reaction) => {
      const emoji = Object.keys(reaction);
      const value = Object.values(reaction);
      return (
        <span className="is-align-items-center">
          <span className="px-5  is-size-5">{emoji}</span> <span className="is-size-6 pr-10">{value}</span>
        </span>
      )
    })
  };

  const renderTopTags = () => {
    return topTags.map((tag) => {
      const label = Object.keys(tag);
      return (
        <>
          <span class="tag is-rounded is-info is-light has-text-weight-medium ml-5 is-uppercase is-size-8">{label}</span>
        </>
      )
    })
  };

  return (
    <>
      <div className="tile">
        <div className="tile has-background-white border-radius-4px box is-child">
          <div className="columns is-vcentered">
            <div className="column is-2">
              <div className="is-flex">
                <img
                  className={clsx("mr-20", styles.avatar)}
                  src={avatarUrl}
                  alt="avatar"
                />
                <div className="is-flex is-flex-direction-column is-justify-content-center">
                  <p className="has-text-black has-text-weight-semibold is-size-4">
                    {firstName} {lastName}
                  </p>
                  <p className="has-text-black is-size-7 is-underlined">
                    {githubUsername}
                  </p>
                </div>
              </div>
            </div>
            <div className="is-divider-vertical" />
            <div className="column">
              <div className="columns is-vcentered">
                <div className="column is-3">
                  <p className="is-size-7 has-text-grey has-text-weight-medium">
                    TOTAL COMMENTS
                  </p>
                  <p className="pl-5 is-size-4 has-text-weight-semibold">{totalSmartComments}</p>
                </div>
                <div className="column is-4">
                  <p className="is-size-7 has-text-grey has-text-weight-medium">
                    TOP REACTIONS
                  </p>
                  <p className="pl-5">
                    {renderTopReactions()}
                  </p>
                </div>
                <div className="column is-5">
                  <p className="is-size-7 has-text-grey has-text-weight-medium">
                    TOP TAGS
                  </p>
                  <p className="pl-5">
                    {renderTopTags()}
                  </p>
                </div>
              </div>
            </div>
            <div className="is-divider-vertical" />
            <div className="column is-2 is-flex is-justify-content-center is-align-items-center">
              <button className="button is-primary" onClick={() => window.open(`${GITHUB_URL}/${githubUsername}`, '_blank').focus()}>View Public Profile</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PersonalStatsTile;
