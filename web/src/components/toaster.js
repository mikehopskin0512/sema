import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import toaster from 'toasted-notes';

const Toaster = (props) => {
  const {
    showAlert = false, type = 'success',
    message = 'Request failed', children,
    position = 'top', duration = 4000,
  } = props;

  // Set alert style based on type
  let alertStyle = 'is-success is-light';
  switch (type) {
  case 'error':
    alertStyle = 'is-danger is-light';
    break;
  case 'info':
    alertStyle = 'is-info is-light';
    break;
  default:
    alertStyle = 'is-success is-light';
  }

  // Build alert message from children or message string
  const toasterMessage = children || <h4>{message}</h4>;

  // Trigger toaster on component load or props change
  useEffect(() => {
    if (showAlert) {
      toaster.notify(({ onClose }) => (
        // Using button here messes up styles
        <a href={null} onClick={onClose}>
          <div className={`notification toaster ${alertStyle}`}>
            <i className="delete" />
            {toasterMessage}
          </div>
        </a>
      ), {
        position,
        duration,
      });
    }
  }, [showAlert, alertStyle, toasterMessage, position, duration]);

  return (null);
};

Toaster.propTypes = {
  message: PropTypes.string.isRequired,
};

export default Toaster;
