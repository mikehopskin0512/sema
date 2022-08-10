import React from 'react';
import clsx from 'clsx';
import { REPO_VISIBILITY } from '../../../../utils/constants';
import styles from './statusChip.module.scss';

function StatusChip({ visibility }) {
  return (
    <div className={clsx('border-radius-8px py-3 px-8', 
      styles['chip-wrapper'],
      visibility === REPO_VISIBILITY.PUBLIC ?
        'has-background-gray-200' :
        'has-background-green-50'
    )}>
      <span className="is-size-8 is-capitalized">
        {`${REPO_VISIBILITY[visibility?.toUpperCase()]} Repo`}
      </span>
    </div>
  );
}

export default StatusChip;
