import React from 'react';
import clsx from 'clsx';
import EngGuideRow from '../engGuideRow';
import styles from './engGuideTable.module.scss';

const EngGuideTable = () => (
  <div className={clsx('table-container', styles['table-wrapper'])}>
    <table className={clsx('table is-fullwidth my-25', styles.table)}>
      <thead className={clsx('is-fullwidth', styles.thead)}>
        <tr>
          <th className="is-uppercase has-text-weight-semibold is-size-7 p-10">Document name / Description</th>
          <th className="is-uppercase has-text-weight-semibold is-size-7 p-10">Collection</th>
          <th className="is-uppercase has-text-weight-semibold is-size-7 p-10">Languages</th>
          <th className="is-uppercase has-text-weight-semibold is-size-7 p-10">Other tags</th>
          <th className="is-uppercase has-text-weight-semibold is-size-7 p-10">Source</th>
          <th className="is-uppercase has-text-weight-semibold is-size-7 p-10">Author / Creation date</th>
        </tr>
      </thead>
      <tbody className="is-fullwidth">
        <EngGuideRow />
        <EngGuideRow />
      </tbody>
    </table>
  </div>
);

export default EngGuideTable;
