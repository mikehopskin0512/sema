import React from "react";
import { useSelector } from "react-redux";
import clsx from "clsx";
import styles from "./personalStatsTile.module.scss";
import { GITHUB_URL } from "../../../utils/constants";

const PersonalStatsTile = ({ topTags, topReactions, totalSmartComments }) => {
  const auth = useSelector((state) => state.authState);
  const {
    user: {
      firstName,
      lastName,
      username,
      avatarUrl,
      identities = []
    },
  } = auth;
  // Get GitHub identity
  const { username: githubUsername } = identities.length && identities.find((item) => item?.provider === "github");

  const renderTopReactions = () => {
    return topReactions.map((reaction) => {
      const emoji = Object.keys(reaction);
      const value = Object.values(reaction);
      return (
        <span className="is-align-items-center is-flex is-flex-grow-1">
          <span className="px-5 is-size-5">{emoji}</span> <span className="is-size-6 pr-10 has-text-black-950">{value}</span>
        </span>
      )
    })
  };

  const renderTopTags = () => {
    return topTags.map((tag) => {
      const label = Object.keys(tag);
      return (
        <>
          <span class="tag is-rounded is-primary is-light has-text-weight-semibold mr-5 mb-5 is-uppercase is-size-8">{label}</span>
        </>
      )
    })
  };

  return (
    <>
      <div className="tile">
        <div className="tile has-background-white border-radius-4px box is-child">
          <div className="columns is-vcentered">
            <div className="column is-4">
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
            {/* <div className="is-divider-vertical" /> */}
            <div className="vertical-divider" />
            <div className="column">
              <div className="columns">
                <div className="column is-3 is-flex is-flex-direction-column is-justify-content-space-between">
                  <p className="is-size-8 has-text-grey has-text-weight-semibold mb-5">
                    TOTAL COMMENTS
                  </p>
                  <p className="m-0 is-size-4 has-text-weight-semibold has-text-black-950">{totalSmartComments}</p>
                </div>
                <div className="column is-4 is-flex is-flex-direction-column is-justify-content-space-between">
                  <p className="is-size-8 has-text-grey has-text-weight-semibold mb-5">
                    TOP REACTIONS
                  </p>
                  <p className="is-flex is-flex-wrap-wrap pb-3">
                    {renderTopReactions()}
                  </p>
                </div>
                <div className="column is-5 is-flex is-flex-direction-column is-justify-content-space-between">
                  <p className="is-size-8 has-text-grey has-text-weight-semibold mb-5">
                    TOP TAGS
                  </p>
                  <p>
                    {renderTopTags()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PersonalStatsTile;
