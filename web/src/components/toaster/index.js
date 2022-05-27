import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import toaster from 'toasted-notes';
import Router from 'next/router';
import { RouterContext } from 'next/dist/next-server/lib/router-context';
import {
  AlertFilledIcon,
  CheckFilledIcon,
  CloseIcon,
  InfoFilledIcon,
  WarningFilledIcon
} from '../Icons';
import styles from './toaster.module.scss';

function ToasterIcon({ type }) {
  if (type === 'success') return <CheckFilledIcon />;
  if (type === 'error') return <AlertFilledIcon />;
  if (type === 'warning') return <WarningFilledIcon />;
  if (type === 'info') return <InfoFilledIcon />;
  return null;
}

function ToasterElement({ onClose, description, title, type, subtitle }) {
  return (
    <div
      className={`p-16 is-flex is-align-items-flex-start has-background-white ${styles[`container--${type}`]}`}
    >
      <div className={styles.icon}>
        <ToasterIcon type={type} />
      </div>
      <div className="is-flex is-flex-direction-column">
        <div className={`${styles.title} has-text-weight-semibold`}>{title}</div>
        {!!subtitle && <div className={`${styles.subtitle}`}>{subtitle}</div>}
        {description && <div className="mt-8 is-size-7" onClick={onClose}>
          {description}
        </div>}
      </div>
      <button
        type="button"
        className={`p-8 button is-white has-text-gray-600 ${styles['close-button']}`}
        onClick={onClose}
      >
        <CloseIcon size="small" />
      </button>
    </div>
  );
}

const notify = (
  message = 'Request failed',
  {
    type = 'success',
    position = 'top-right',
    duration = 4000,
    subtitle,
    description,
    ...options
  } = {},
) => {
  // Set alert style based on type
  let alertStyle = 'is-success';
  switch (type) {
    case 'error':
      alertStyle = 'is-danger';
      break;
    case 'info':
      alertStyle = 'is-info';
      break;
    default:
      alertStyle = 'is-success';
  }
  return toaster.notify(
    ({ onClose }) => (
      <RouterContext.Provider value={Router}>
        <ToasterElement type={type} onClose={onClose} title={message} subtitle={subtitle} description={description} />
      </RouterContext.Provider>
    ),
    {
      ...options,
      position,
      duration
    }
  );
};

const Toaster = ({
  showAlert = false,
  type,
  message,
  children,
  position,
  duration
}) => {
  // Build alert message from children or message string
  const toasterMessage = children || <h4>{message}</h4>;

  useEffect(() => {
    if (showAlert) {
      notify(toasterMessage, { type, position, duration });
    }
  }, [showAlert, toasterMessage, position, duration]);

  return null;
};

Toaster.propTypes = {
  message: PropTypes.string.isRequired
};

export { Toaster as default, notify };
