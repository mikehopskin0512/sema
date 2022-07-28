import React from 'react';
import styles from './progressBar.module.scss';

const ProgressBar = ({ percent }) => {
  return (
    <>
      <svg className={styles['progress-container']} viewBox="2 -2 28 36" xmlns="http://www.w3.org/2000/svg">
        <circle className={styles['progress-background']} r="16" cx="16" cy="16"/>
        <circle
          className={styles['circle-progress']}
          r="16"
          cx="16"
          cy="16"
          style={{strokeDasharray: `${percent} 100`}}
        />
      </svg>
      <div className={styles.percentage}>
        {percent}%
      </div>
    </>
  )
}



export default ProgressBar;
