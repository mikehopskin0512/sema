import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import LabelsTableRow from '../LabelsTableRow';
import tableStyles from '../../repos/repoTable/repoTable.module.scss';
import styles from './labelsTable.module.scss';

const LabelsTable = ({ data }) => (
  <div className={clsx(tableStyles['table-wrapper'], styles['show-overflow-y'])}>
    <table className={clsx('table is-fullwidth', tableStyles.table)}>
      <thead className={clsx('is-fullwidth', tableStyles.thead)}>
        <tr>
          <th className="is-uppercase has-text-weight-semibold is-size-8 p-10">Label</th>
          <th className="is-uppercase has-text-weight-semibold is-size-8 p-10">Category</th>
          <th className="is-uppercase has-text-weight-semibold is-size-8 p-10">Suggested Comments</th>
          <th></th>
        </tr>
      </thead>
      <tbody className="is-fullwidth">
        { data.map((tag) => <LabelsTableRow data={tag} key={`tag-${tag.label}`} />) }
      </tbody>
    </table>
  </div>
);

LabelsTable.defaultProps = {
  data: [],
};

LabelsTable.propTypes = {
  data: PropTypes.array,
};

export default LabelsTable;
