import React from 'react';
import clsx from 'clsx';
import styles from './InteractionCircleChart.module.scss';
import { userInteractionScore } from '../../../utils/constants/interactionCircleDummyData';
import { DEFAULT_AVATAR } from '../../../utils/constants';

const InteractionCircleChart = ({ users = [] }) => {
  return (
    <div className="circle-container">
      {userInteractionScore.map((user, index) => {
        return (
          <div
            className={clsx(styles['circle'], styles[`user-${index}`])}
            key={index}
          >
            <img src={user.avatar || DEFAULT_AVATAR} alt="user" className={clsx(styles.img)} />
          </div>
        );
      })}
    </div>
  );
};

export default InteractionCircleChart;
