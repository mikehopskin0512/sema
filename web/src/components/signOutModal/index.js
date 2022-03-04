import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { authOperations } from '../../state/features/auth';
import * as analytics from '../../utils/analytics';

const { deauthenticate } = authOperations;

const SignOutModal = ({ active, onClose }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogout = () => {
    setLoading(true);
    dispatch(deauthenticate());
    analytics.fireAmplitudeEvent(analytics.AMPLITUDE_EVENTS.CLICKED_LOG_OUT, { url: '/logout' });
    analytics.segmentTrack(analytics.SEGMENT_EVENTS.USER_LOGOUT, {});
  };

  return (
    <div className={`modal ${active ? 'is-active' : ''}`}>
      <div className="modal-background" />
      <div className="modal-content px-10">
        <div className="p-50 has-background-white">
          <p className="has-text-black has-text-weight-bold is-size-5 has-text-centered mb-30">Are you sure you want to log out?</p>
          <div className="is-flex">
            <div className="is-flex-grow-1 px-10">
              <button className="button is-fullwidth has-text-weight-semibold is-size-7" onClick={() => onClose()} type="button">Cancel</button>
            </div>
            <div className="is-flex-grow-1 px-10">
              <button
                className={clsx('button is-primary is-fullwidth has-text-weight-semibold is-size-7', loading ? 'is-loading' : '')}
                type="button"
                onClick={handleLogout}
              >
                Yes, log me out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

SignOutModal.propTypes = {
  active: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SignOutModal;
