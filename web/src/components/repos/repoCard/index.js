import React from 'react';
import clsx from 'clsx';
import styles from './repoCard.module.scss';

const RepoCard = () => {
  const renderLangTag = (lang) => (
    <div className="has-background-tag-blue border-radius-14px py-5 px-15">
      <p className="has-text-tag-text is-size-8">{lang}</p>
    </div>
  );

  const renderStats = () => (
    <div className="has-background-gray-b border-radius-4 p-15 is-full-width is-flex is-justify-content-center">
      <div>
        <p className="is-size-9 has-text-weight-semibold has-text-stat">HEHE</p>
        <p className="is-size-4 has-text-weight-semibold has-text-black">23</p>
      </div>
    </div>
  );

  return (
    <div className="box has-background-gray-3 is-full-width p-0 border-radius-2px is-clipped">
      <div className="is-flex is-justify-content-space-between p-12">
        <p className="has-text-black-2 has-text-weight-semibold is-size-5">Repo_abc</p>
      </div>
      <div className="has-background-white">
        <div className="px-12 py-8">
          <p className="is-size-7">Repo description lorem ipsum lorem ipsum </p>
          <div className="is-flex is-justify-content-space-between py-12">
            {renderLangTag('Java')}
          </div>
        </div>
        <div className={clsx('tile is-ancestor is-12', styles['no-margin'])}>
          <div className={clsx('tile is-3 is-full-width', styles.stat)}>
            {renderStats()}
          </div>
          <div className={clsx('tile is-3 is-full-width', styles.stat)}>
            {renderStats()}
          </div>
          <div className={clsx('tile is-3 is-full-width', styles.stat)}>
            {renderStats()}
          </div>
          <div className={clsx('tile is-3 is-full-width', styles.stat)}>
            {renderStats()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepoCard;
