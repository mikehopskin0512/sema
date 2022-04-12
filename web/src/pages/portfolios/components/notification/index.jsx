import React from 'react';
import clsx from 'clsx';
import { func, node, string } from 'prop-types';
import { CloseIcon } from '../../../../components/Icons';
import styles from '../../portfolios.module.scss';

// TODO: add general component for notifications
const PortfolioListNotification = ({
  text,
  icon,
  onClose,
  onRetry,
}) => (
  <div className={clsx('message  shadow mt-40', 'is-red-500')}>
    <div className="message-body has-background-white is-flex">
      {icon}
      <div className={styles['notification-toast-content-wrapper']}>
        <div className="is-flex is-justify-content-space-between mb-5 wi">
          <span className="is-line-height-1 has-text-weight-semibold has-text-black ml-8 mb-0">
            {text}
          </span>

          <button
            type="button"
            onClick={onClose}
            className={clsx('is-relative t-10 is-transparent', styles['notification-toast-button'], styles['notification-toast-icon'])}>
            <CloseIcon size="medium" />
          </button>
        </div>
        <button
          type="button"
          className={
            clsx(
              'is-line-height-1 aui-has-text-blue-500-dark is-underlined ml-8 is-transparent has-background-transparent is-size-6',
              styles['notification-toast-button'],
            )
          }
          onClick={onRetry}>
          Try again
        </button>
      </div>
    </div>
  </div>
);

PortfolioListNotification.propTypes = {
  text: string.isRequired,
  icon: node.isRequired,
  onClose: func,
  onRetry: func,
};

PortfolioListNotification.defaultProps = {
  onClose: () => {
  },
  onRetry: () => {
  },
};

export default PortfolioListNotification;
