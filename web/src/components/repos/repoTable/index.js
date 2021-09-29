import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import styles from './repoTable.module.scss';
import RepoRow from '../repoRow';

const RepoTable = ({ data }) => (
  <div className={clsx('table-container', styles['table-wrapper'])}>
    <table className={clsx('table is-fullwidth my-25', styles.table)}>
      <thead className={clsx('is-fullwidth', styles.thead)}>
        <tr>
          <th className="is-uppercase has-text-weight-semibold is-size-8 p-10">Repo</th>
          <th className="is-uppercase has-text-weight-semibold is-size-8 p-10">Description</th>
          <th className="is-uppercase has-text-weight-semibold is-size-8 p-10 has-text-centered">Smart code<br/>reviews</th>
          <th className="is-uppercase has-text-weight-semibold is-size-8 p-10 has-text-centered">Smart<br/>comments</th>
          <th className="is-uppercase has-text-weight-semibold is-size-8 p-10 has-text-centered">Smart<br/>commenters</th>
          <th className="is-uppercase has-text-weight-semibold is-size-8 p-10 has-text-centered">Sema Users</th>
          <th></th>
        </tr>
      </thead>
      <tbody className="is-fullwidth">
        {data.map((item) => (<RepoRow {...item} key={`guide-${item._id}`} />))}
      </tbody>
    </table>
  </div>
);

RepoTable.defaultProps = {
  data: [],
};

RepoTable.propTypes = {
  data: PropTypes.array,
};

export default RepoTable;
