import React from "react";
import { useSelector } from "react-redux";
import clsx from "clsx";
import styles from "./personalStatsTile.module.scss";

const PersonalStatsTile = () => {
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
  const { username: githubUsername } = identities[0];

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
                  <p>23</p>
                </div>
                <div className="column is-4">
                  <p className="is-size-7 has-text-grey has-text-weight-medium">
                    TOP REACTIONS
                  </p>
                  <p><span>23</span><span>23</span><span>23</span></p>
                </div>
                <div className="column is-5">
                  <p className="is-size-7 has-text-grey has-text-weight-medium">
                    TOP TAGS
                  </p>
                  <p>
                  <span class="tag is-info is-light has-text-weight-medium m-5">SECURE</span>
                  <span class="tag is-info is-light has-text-weight-medium m-5">ELEGANT</span>
                  <span class="tag is-info is-light has-text-weight-medium m-5">PERFORMANT</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="is-divider-vertical" />
            <div className="column is-2 is-flex is-justify-content-center is-align-items-center">
              <button className="button is-primary">View Public Profile</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PersonalStatsTile;
