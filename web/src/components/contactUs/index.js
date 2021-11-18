import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import styles from './contactUs.module.scss';

const ContactUs = ({ userVoiceToken, openSupportForm }) => {
  const renderContent = () => (
    <div
      className='is-flex is-align-content-center container is-justify-content-space-between is-flex-wrap-wrap is-full-width is-align-items-center'
      style={{ minHeight: '100px'}}
    >
      <div>
        <div className="has-text-white is-size-3">We want to hear from you</div>
        <div className="has-text-white is-size-6 mt-10">
          Please share your thoughts with us so we can continue to craft an amazing developer experience
        </div>
      </div>

      <div className={clsx("is-flex is-flex-direction-row is-justify-content-center is-align-content-center is-hidden-mobile", styles['contact-us-desktop'])}>
        <button onClick={openSupportForm} className={clsx('button is-gray-100 has-text-primary is-medium mr-20 my-5 px-50', styles.button)} type="button">Email</button>
        { userVoiceToken && (
          <a
            className={clsx('button is-gray-100 has-text-primary has-text-weight-semibold is-medium mx-20 my-5 px-50', styles.button)}
            href={`https://sema.uservoice.com/?sso=${userVoiceToken}`}
            target="_blank"
            rel="noreferrer">
            Idea Board
          </a>
        ) }
      </div>

      <div className="is-hidden-desktop is-full-width is-flex is-flex-direction-column is-align-items-center mt-20">
        <button onClick={openSupportForm} className={clsx('button is-gray-100 has-text-primary has-text-weight-semibold is-medium my-10', styles.button)} type="button">Email</button>
        { userVoiceToken && (
          <a
            className={clsx('button is-gray-100 has-text-primary has-text-weight-semibold is-medium my-10', styles.button)}
            href={`https://sema.uservoice.com/?sso=${userVoiceToken}`}
            target="_blank"
            rel="noreferrer">
            Idea Board
          </a>
        ) }
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop View */}
      <div className="py-30 has-background-primary is-justify-content-space-evenly is-align-items-center is-flex is-hidden-touch">
        {renderContent()}
      </div>
      {/* Mobile View */}
      <div className="p-25 has-background-primary is-justify-content-space-evenly is-align-items-center is-hidden-desktop">
        {renderContent()}
      </div>
    </>
  );
};

ContactUs.defaultProps = {
  userVoiceToken: null,
};

ContactUs.propTypes = {
  userVoiceToken: PropTypes.string,
  openSupportForm: PropTypes.func.isRequired,
};

export default ContactUs;
