import React from 'react';
import ReactTooltip from 'react-tooltip';
import clsx from 'clsx';
import styles from './InteractionCircleChart.module.scss';
import { DEFAULT_AVATAR } from '../../../utils/constants';

const InteractionCircleChart = ({
  interactions = {},
  user,
}) => {
  if (!interactions) {
    return null;
  }

  const users = [
    user,
    ...interactions?.sort((a, b) => b.count - a.count)
      .slice(0, 45),
  ];

  const onCircleClick = (name) => {
    return window.open(`https://github.com/${name}`)
  }

  return (
    <>
      <div className='circle-container'>
        {users.map((user, index) => {
          const name = user.name ?? user.handle;
          return (
            <>
              <div
                onClick={() => onCircleClick(name)}
                className={clsx(styles['circle'], styles[`user-${index}`])}
                key={name}
                data-for={name}
                data-tip={name}>
                <img src={user.avatarUrl || DEFAULT_AVATAR} alt='user' className={clsx(styles.img)} />
              </div>
              <ReactTooltip id={name}/>
            </>
          );
        })}
      </div>
    </>
  );
};

export default InteractionCircleChart;
