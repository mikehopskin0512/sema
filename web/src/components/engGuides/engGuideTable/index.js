import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import EngGuideRow from '../engGuideRow';
import styles from './engGuideTable.module.scss';
import Checkbox from '../../checkbox';

const EngGuideTable = ({ data, selectedGuides, handleSelectChange, handleSelectAllChange }) => (
  <div className={clsx('table-container', styles['table-wrapper'])}>
    <table className={clsx('table is-fullwidth my-25', styles.table)}>
      <thead className={clsx('is-fullwidth', styles.thead)}>
        <tr>
          <th className="is-uppercase has-text-weight-semibold is-size-7 p-10">
            <div className="is-flex is-align-items-center">
              <div className="mr-10">
                <Checkbox
                  value={selectedGuides.length === data.length}
                  intermediate={!!selectedGuides.length && selectedGuides.length !== data.length}
                  onChange={handleSelectAllChange}
                />
              </div>
              <div>
                Document name / Description
              </div>
            </div>
          </th>
          <th className="is-uppercase has-text-weight-semibold is-size-7 p-10">Collection</th>
          <th className="is-uppercase has-text-weight-semibold is-size-7 p-10">Languages</th>
          <th className="is-uppercase has-text-weight-semibold is-size-7 p-10">Other tags</th>
          <th className="is-uppercase has-text-weight-semibold is-size-7 p-10">Source</th>
          <th className="is-uppercase has-text-weight-semibold is-size-7 p-10">Author / Creation date</th>
        </tr>
      </thead>
      <tbody className="is-fullwidth">
        {data.map((item) => (
          <EngGuideRow
            selected={!!selectedGuides.find((g) => g === item._id)}
            handleSelectChange={handleSelectChange}
            {...item}
            key={`guide-${item._id}`}
          />
        ))}
      </tbody>
    </table>
  </div>
);

EngGuideTable.defaultProps = {
  data: [],
  selectedGuides: [],
  handleSelectChange: () => {},
  handleSelectAllChange: () => {},
};

EngGuideTable.propTypes = {
  data: PropTypes.array,
  selectedGuides: PropTypes.array,
  handleSelectChange: PropTypes.func,
  handleSelectAllChange: PropTypes.func,
};

export default EngGuideTable;
