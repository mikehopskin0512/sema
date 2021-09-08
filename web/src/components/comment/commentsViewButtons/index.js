import React from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import styles from './commentsViewButtons.module.scss';

const CommentsViewButtons = () => {
  const router = useRouter();
  const { asPath } = router;

  return (
    <div className="is-flex my-5">
      <a href="/suggested-comments">
        <button
          className={clsx('button is-small border-radius-4px', styles['button-collections'], asPath === '/suggested-comments' ? 'is-primary' : '')}
          type="button">
          <span className="is-hidden-mobile">Comment Collections</span>
          <span className="is-hidden-desktop">Collections</span>
        </button>
      </a>
      <a href="/comments">
        <button
          className={clsx('button is-small border-radius-4px', styles['button-suggested'], asPath === '/comments' ? 'is-primary' : '')}
          type="button">
          Suggested Comments
        </button>
      </a>
    </div>
  );
};

export default CommentsViewButtons;
