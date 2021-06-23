import React from 'react';
import clsx from 'clsx';
import styles from './404.module.scss';

const NotFound = () => (
  <div className={clsx(styles.body, 'hero background-gray-white is-fullheight p-15 is-flex is-flex-direction-column is-justify-content-center is-align-content-center is-align-items-center')}>
    <img src="/img/404.png" alt="Not Found" />
    <p className="has-text-weight-semibold is-size-2 has-text-black mt-70">OOOOPS</p>
    <p className="is-size-5 has-text-black mt-10 has-text-centered">Sorry, we can’t find the page but here is a doughnut!</p>
    <div className="mt-70">
      <a
        type="button"
        className="button is-primary"
        href="/dashboard">
        <span>Return to Dashboard</span>
      </a>
    </div>
    {/* TODO: Add Feedback form for this button */}
    <button className="button is-text has-text-black is-button-bottom is-absolute-bottom mb-10" type="button">Contact us for help</button>
  </div>
);

export default NotFound;
