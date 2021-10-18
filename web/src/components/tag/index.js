import React from 'react';
import clsx from 'clsx';

const Tag = ({ tag, _id, type }) => (
  <div
    className={
      clsx(
        'tag is-uppercase is-rounded is-size-8 has-text-weight-semibold mr-5',
        type === 'language' ? 'has-text-primary has-background-primary-light' : 'is-light'
      )
    }
    key={`${type}-${tag}-${_id}`}>
    {tag}
  </div>
)

export default Tag;