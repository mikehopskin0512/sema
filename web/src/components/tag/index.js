import React from 'react';
import clsx from 'clsx';
import styles from './tag.module.scss';

const Tag = ({ tag, _id, type }) => (
  <div
    className={
      clsx(
        'tag is-uppercase is-rounded is-size-8 has-text-weight-semibold mr-5',
        type === 'language' ? 'has-text-primary' : 'is-light',
        type === 'language' ? styles.language : styles.guide,
      )
    }
    key={`${type}-${tag}-${_id}`}>
    {tag}
  </div>
)

export default Tag;