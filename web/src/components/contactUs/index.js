import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import styles from './contactUs.module.scss';

const ContactUs = ({ userVoiceToken, openSupportForm }) => {
  const renderContent = () => (
    <div
      className='is-flex is-align-content-center is-justify-content-space-between is-full-width px-50 is-align-items-center'
      style={{maxWidth: '1540px', minHeight: '100px'}}
    >
      <div>
        <div className="title has-text-white is-size-4 has-text-weight-semibold">We want to hear from you</div>
        <div className="subtitle has-text-white is-size-6">
          Please share your thoughts with us so we can continue to craft an amazing developer experience
        </div>
      </div>

      <div className="ml-30 is-flex is-flex-direction-row is-justify-content-center is-align-content-center">
        <button onClick={openSupportForm} className={clsx('button is-white-gray has-text-primary is-medium mx-20 my-5 px-50', styles.button)} type="button">Contact Us</button>
        { userVoiceToken && (
          <a
            className={clsx('button is-white-gray has-text-primary is-medium mx-20 my-5 px-50', styles.button)}
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
      <div className="py-50 has-background-primary is-justify-content-space-evenly is-align-items-center is-flex is-hidden-mobile">
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
