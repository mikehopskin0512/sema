import React from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import styles from './InteractionCircleChart.module.scss';
import { DEFAULT_AVATAR } from '../../../utils/constants';

const InteractionCircleChart = ({ interactions = {} }) => {
  const { user } = useSelector((state) => state.authState);

  // TODO: need to add a banner if it's a private repo
  // TODO: need to add a banner if sync is not complete

  if (!interactions) {
    return null;
  }

  // TODO there should be a different way to layout it, because the user always will be at the center, so, it's just an example but it should be done in layout
  const users = [
    user,
    ...interactions.sort((a, b) => b.count - a.count).slice(0, 7),
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
