import React from 'react';
import clsx from 'clsx';
import styles from './suggestedCommentCard.module.scss';

const description = 'Avoid using DOM component prop names for different purposes. Why? People expect props like style and className to mean one specific thing. Varying this API for a subset of your app makes the code less readable and less maintainable, and may cause bugs.';

const SuggestedCommentCard = () => (
  <div className={clsx('has-background-white border-radius-4px px-40 py-20 my-20', styles.container)}>
    <div className="is-flex is-justify-content-space-between is-align-items-center is-flex-wrap-wrap">
      <p className="has-text-weight-semibold is-size-5 has-text-deep-black">Clever is not always better</p>
      <div className="is-flex is-flex-wrap-wrap">
        <span className={clsx('tag is-rounded is-uppercase m-5 is-light is-normal', styles.language)}>Javascript</span>
        <span className={clsx('tag is-rounded is-uppercase m-5 is-light is-normal', styles.language)}>Architecture</span>
        <span className={clsx('tag is-rounded is-uppercase m-5 is-light is-normal', styles.language)}>API</span>
      </div>
    </div>
    <div className="is-flex is-justify-content-space-between is-align-items-center my-10 is-flex-wrap-wrap">
      <div className="is-flex is-align-items-center">
        <img src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50" alt="user avatar" className={styles.avatar} />
        <p className="is-size-6 mx-10 has-text-deep-black">sema</p>
        <div className={styles.vl} />
        <p className="has-text-deep-black is-size-6 mx-10"><b>Source: </b> Airbnb</p>
      </div>
      <button className="button is-text is-small p-0 has-text-deep-black" type="button">Airbnb Javascript Style Guide</button>
    </div>
    <p className="has-text-deep-black is-size-6 my-20">
      {description}
    </p>
    <div className="is-flex is-justify-content-space-between is-align-items-center mt-10 is-flex-wrap-wrap">
      <p className="has-text-deep-black is-size-6"><b>Supporting Documents:</b> Document-007-Props Naming</p>
      <p className="is-size-8 has-text-black-6">31 Jun, 2021</p>
    </div>
  </div>
);

export default SuggestedCommentCard;
