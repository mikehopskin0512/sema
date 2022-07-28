import ProgressBar from './progressBar';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import clsx from 'clsx';
import styles from './InteractionCircleChart.module.scss';
import { DEFAULT_AVATAR } from '../../../utils/constants';

const MAX_PEOPLE = 45;

const InteractionCircleChart = ({
  interactions = {},
  user,
  progress,
}) => {
  if (!interactions) {
    return null;
  }

  const progressPercent = Math.round(progress?.overall * 100);
  const isNotCompleted = progressPercent < 100;
  const placeholders = isNotCompleted ? Array.from(
    { length: MAX_PEOPLE - interactions.length },
    () => ({ isPlaceholder: true })
  ) : [];
  const users = [
    user,
    ...interactions?.sort((a, b) => b.count - a.count).slice(0, MAX_PEOPLE),
    ...placeholders,
  ];

  const onCircleClick = (name) => {
    return window.open(`https://github.com/${name}`)
  }

  return (
      <div className={styles['circle-container']}>
        <div className={styles['circle-inner-container']}>
          {users.map((user, index) => {
          const name = user.name ?? user.handle;
          const isUserItself = index === 0;
          const isPlaceholder = user.isPlaceholder;
          const isPercentageShown = isUserItself && isNotCompleted;
          return (
            <>
              <div
                onClick={() => !isPlaceholder && onCircleClick(name)}
                className={clsx(styles['circle'], styles[`user-${index}`])}
                key={name}
                data-for={name}
                data-tip={name}>
                {isPercentageShown && <ProgressBar percent={progressPercent} />}
                {!isPlaceholder && (
                  <img src={user.avatarUrl || DEFAULT_AVATAR} alt='user' className={clsx(styles.img)} />
                )}
              </div>
              <ReactTooltip id={name}/>
            </>
          );
        })}
        </div>
      </div>
  );
};

export default InteractionCircleChart;
