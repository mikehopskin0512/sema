import ProgressBar from './progressBar';
import React, { useMemo } from 'react';
import ReactTooltip from 'react-tooltip';
import clsx from 'clsx';
import { useRouter } from 'next/router';
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
  const router = useRouter();
  const { pathname } = router;
  const isNegativeColors = pathname.includes('collaboration');
  const progressPercent = Math.round(progress?.overall * 100);
  const isNotCompleted = progressPercent < 100;
  const placeholders = useMemo(() => getPlaceholders(interactions.length), [interactions]);
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
          const circleStyle = !isPlaceholder ? 'circle' : isNegativeColors ? 'empty-negative-circle' : 'empty-circle';
          const isPercentageShown = isUserItself && isNotCompleted;
          return (
            <>
              {!isPlaceholder && <ReactTooltip id={isUserItself ? 'first-item' : name}/>}
              <div
                onClick={() => !isPlaceholder && onCircleClick(name)}
                className={clsx(styles[circleStyle], styles[`user-${index}`])}
                key={isUserItself  ? 'first-item' : name}
                data-for={isUserItself ? 'first-item' : name}
                data-tip={name ? `${name}`: null}
                >
                {isPercentageShown && <ProgressBar percent={progressPercent} />}
                {!isPlaceholder && (
                  <img src={user.avatarUrl || DEFAULT_AVATAR} alt='user' className={clsx(styles.img)} />
                )}
              </div>
            </>
          );
        })}
        </div>
      </div>
  );
};

export default InteractionCircleChart;
