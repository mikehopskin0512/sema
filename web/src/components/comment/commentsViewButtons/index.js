import React from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import styles from './commentsViewButtons.module.scss';
import { PATHS } from '../../../utils/constants';

const CommentsViewButtons = () => {
  const router = useRouter();
  const { asPath } = router;

  return (
    <div className="is-flex my-5">
      <a href={PATHS.SUGGESTED_SNIPPETS._}>
        <button
          className={clsx('button is-small border-radius-4px', styles['button-collections'], asPath === PATHS.SUGGESTED_SNIPPETS._ ? 'is-primary' : '')}
          type="button">
          <span className="is-hidden-mobile">Snippet Collections</span>
          <span className="is-hidden-desktop">Collections</span>
        </button>
      </a>
      <a href={PATHS.SUGGESTED_SNIPPETS._}>
        <button
          className={clsx('button is-small border-radius-4px', styles['button-suggested'], asPath === '/comments' ? 'is-primary' : '')}
          type="button">
          Snippets
        </button>
      </a>
    </div>
  );
};

export default CommentsViewButtons;
