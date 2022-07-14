import React from 'react';
import clsx from 'clsx';
import styles from './InteractionCircleChart.module.scss';
import { DEFAULT_AVATAR } from '../../../utils/constants';

const InteractionCircleChart = ({ interactions = {}, user }) => {
  if (!interactions) {
    return null;
  }

  const users = [
    user,
    ...interactions?.sort((a, b) => b.count - a.count).slice(0, 45),
  ]

  return (
    <div className="circle-container">
      {users.map((user, index) => {
        return (
          <div
            className={clsx(styles['circle'], styles[`user-${index}`])}
            key={index}
          >
            <img src={user.avatarUrl || DEFAULT_AVATAR} alt="user" className={clsx(styles.img)} />
          </div>
        );
      })}
    </div>
  );
};

export default InteractionCircleChart;
