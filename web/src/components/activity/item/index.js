/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import clsx from 'clsx';
import styles from './item.module.scss';

const ActivityItem = () => (
  <div className="has-background-white py-20 px-25 border-radius-4px is-flex">
    <figure className="image is-64x64 mr-20 is-hidden-mobile">
      <img className="is-rounded" src="https://bulma.io/images/placeholders/64x64.png" alt="user_icon" />
    </figure>
    <div className="is-flex-grow-1">
      <div className="is-flex is-justify-content-space-between is-flex-wrap-wrap">
        <div className="is-flex is-flex-wrap-no-wrap">
          <figure className="image is-48x48 mt-5 mr-5 is-hidden-desktop">
            <img className="is-rounded" src="https://bulma.io/images/placeholders/64x64.png" alt="user_icon" />
          </figure>
          <p className="is-size-7 has-text-deep-black">
            <a href="#" className="has-text-deep-black is-underlined">John Smith</a>
            {' reviewed '}
            <a href="#" className="has-text-deep-black is-underlined">PHX-1010 Script</a>
          </p>
        </div>
        <p className={clsx('is-size-8', styles.date)}>31 Jun, 2021</p>
      </div>
      <div className="is-flex is-align-items-center is-flex-wrap-wrap">
        <p className="has-text-deep-black has-text-weight-semibold is-size-5 is-size-7-mobile">🛠 This requires a fix!</p>
        <div className="is-divider-vertical" />
        <div className="is-flex is-flex-wrap-wrap">
          <span className="tag is-dark is-rounded is-italic has-text-weight-bold is-size-8 mr-5">Readable</span>
          <span className="tag is-dark is-rounded is-italic has-text-weight-bold is-size-8 mr-5">Elegant</span>
        </div>
      </div>
      <div className="my-10">
        <p className="is-size-7 has-text-deep-black">Hey sally, this is really awesome. I love the way you made this so elegant</p>
      </div>
    </div>
  </div>
);

export default ActivityItem;
