import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import toaster from 'toasted-notes';
import { AlertFilledIcon, CheckFilledIcon, CloseIcon } from './Icons';
import {
  red500,
  green500,
  gray600,
} from '../../styles/_colors.module.scss';

const Toaster = (props) => {
  const {
    showAlert = false, type = 'success',
    message = 'Request failed', children,
    position = 'top', duration = 4000,
  } = props;

  // Set alert style based on type
  let alertStyle, alertIcon;
  switch (type) {
  case 'error':
    alertStyle = 'toaster-error';
    alertIcon = <AlertFilledIcon color={red500} className="mr-8" />;
    break;
  default:
    alertStyle = 'toaster-success';
    alertIcon = <CheckFilledIcon color={green500} className="mr-8" />;
  }

  // Build alert message from children or message string
  const toasterMessage = children || <h4 className='has-text-black-950 has-text-weight-semibold'>{message}</h4>;

  // Trigger toaster on component load or props change
  useEffect(() => {
    if (showAlert) {
      toaster.notify(({ onClose }) => (
        <span>
          <div className={`toaster ${alertStyle} p-16`}>
            <div className='is-flex'>
              {alertIcon}
              <div className='is-flex is-flex-grow-1'>
                {toasterMessage}
              </div>
              <CloseIcon color={gray600} onClick={onClose} className="is-clickable" />
            </div>
          </div>
        </span>
      ), {
        position,
        duration,
      });
    }
  }, [showAlert, alertStyle, toasterMessage, position, duration]);

  return null;
};

Toaster.propTypes = {
  message: PropTypes.string.isRequired,
};

export default Toaster;
