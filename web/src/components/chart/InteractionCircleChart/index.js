import ProgressBar from './progressBar';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import clsx from 'clsx';
import styles from './InteractionCircleChart.module.scss';
import { DEFAULT_AVATAR } from '../../../utils/constants';

const MAX_PEOPLE = 45;
const CIRCLES_LENGTH = {
  FIRST: 7,
  SECOND: 14,
  THIRD: 24,
}
const getPlaceholdersCount = (interactionsCount) => {
  if (interactionsCount <= CIRCLES_LENGTH.FIRST) {
    return CIRCLES_LENGTH.FIRST - interactionsCount;
  }
  if (interactionsCount <= (CIRCLES_LENGTH.FIRST + CIRCLES_LENGTH.SECOND)) {
    return (CIRCLES_LENGTH.FIRST + CIRCLES_LENGTH.SECOND) - interactionsCount;
  }
  return MAX_PEOPLE - interactionsCount;
}
const getPlaceholders = (interactionsCount) => {
  return Array.from(
    { length: getPlaceholdersCount(interactionsCount)},
    () => ({ isPlaceholder: true })
  )
}

const InteractionCircleChart = ({
  interactions = [],
  user,
  progress,
}) => {
  if (!interactions) {
    return null;
  }
  const progressPercent = Math.round(progress?.overall * 100);
  const isNotCompleted = progressPercent < 100;
  const placeholders = isNotCompleted ? getPlaceholders(interactions.length) : [];
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
