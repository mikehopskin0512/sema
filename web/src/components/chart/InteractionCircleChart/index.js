import React from 'react';
import clsx from 'clsx';
import styles from './InteractionCircleChart.module.scss';
import { userInteractionScore } from '../../../utils/constants/interactionCircleDummyData';
import Logo from '@/components/Logo';
import { DEFAULT_AVATAR } from '../../../utils/constants';

const InteractionCircleChart = ({ users = [] }) => {
  return (
    <div className="circle-container">
      {userInteractionScore.map((user, index) => {
        return (
          <div className={clsx(styles['circle'], styles[`user-${index}`])}>
            {/* <img url={DEFAULT_AVATAR} alt="User"></img> */}
          </div>
        );
      })}
    </div>
  );
};

export default InteractionCircleChart;
