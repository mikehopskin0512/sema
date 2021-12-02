import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @ts-ignore
import { removeNotification } from '../../modules/redux/action.js';
import styles from './notification.module.scss';
import { ICONS, DEFAULT_DELAY } from './constants';
import { INotification } from './types';

const Notification = () => {
  const dispatch = useDispatch();
  const notifications: Array<INotification> = useSelector(
    (state: { notifications: Array<INotification> }) => state.notifications,
  );
  const remove = (notification: INotification) => {
    dispatch(removeNotification(notification));
  };
  const addDeferredDeleting = () => {
    notifications.forEach((notification) => {
      setTimeout(
        () => remove(notification),
        notification.delay || DEFAULT_DELAY,
      );
    });
  };
  useEffect(addDeferredDeleting, [notifications]);

  if (!notifications.length) {
    return null;
  }

  return (
    <div className={styles['notification-wrapper']}>
      {notifications.map((notification: INotification) => (
        <div
          className={`${styles.notification} ${
            styles[`notification--${notification.type}`]
          }`}
        >
          <div className={styles['notification-icon']}>
            <img
              src={ICONS[notification.type.toUpperCase() as keyof object]}
              alt="icon"
            />
          </div>
          <div className={styles['notification-body']}>
            {notification.title && (
              <p className={styles['notification-title']}>
                {notification.title}
              </p>
            )}
            {notification.text && (
              <p className={styles['notification-text']}>
                {notification.text}
              </p>
            )}
          </div>
          {notification.isClosedBtn && (
            <div
              onClick={() => remove(notification)}
              className={styles['notification-close-btn']}
            >
              <img src={ICONS.CLOSE} alt="close-icon" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Notification;
