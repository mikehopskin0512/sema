import React from 'react';
import clsx from 'clsx';
import styles from './WaitlistCard.module.scss';

const WaitlistCard = () => (
  <>
    <div className={styles['head-text']}>
      <h4 className="title is-4 has-text-centered">You&apos;re on the list!</h4>
      <h2 className={clsx(
        'subtitle has-text-centered has-text-weight-medium',
        styles['foot-text'],
      )}>
        Thanks for your interest. We&apos;ve added you on the list. We&apos;ll
        email as soon as a slot opens up in the private beta
      </h2>
    </div>
    <div className={clsx(
      'title has-text-centered',
      styles['foot-text'],
    )}>
      Skip the line
    </div>
    <div className={clsx(
      'subtitle has-text-centered has-text-weight-medium',
      styles['foot-text'],
    )}>
      A few people have the ability to invite others.
      <div>
        Keep an eye out for our early testers.
      </div>
    </div>
  </>
);

export default WaitlistCard;
