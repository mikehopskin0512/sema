import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import styles from './repoTable.module.scss';
import RepoRow from '../repoRow';
import usePermission from '../../../hooks/usePermission';

function RepoTable({ data, removeRepo, isOrganizationView }) {
  const { isOrganizationAdmin } = usePermission();

  return (
    <div className={clsx('table-container', styles['table-wrapper'])}>
      <table className={clsx('table is-fullwidth my-25', styles.table)}>
        <thead className={clsx('is-fullwidth', styles.thead)}>
          <tr>
            <th className="is-uppercase has-text-weight-semibold is-size-8 p-10">Repo</th>
            <th className="is-uppercase has-text-weight-semibold is-size-8 p-10">Languages</th>
            <th className="is-uppercase has-text-weight-semibold is-size-8 p-10 has-text-centered">Sema code reviews</th>
            <th className="is-uppercase has-text-weight-semibold is-size-8 p-10 has-text-centered">Sema comments</th>
            <th className="is-uppercase has-text-weight-semibold is-size-8 p-10 has-text-centered">Sema commenters</th>
            <th className="is-uppercase has-text-weight-semibold is-size-8 p-10 has-text-centered">Sema Users</th>
          </tr>
        </thead>
        <tbody className="is-fullwidth">
          {data.map((item) => (<RepoRow {...item} key={`guide-${item._id}`} removeRepo={removeRepo} isOrganizationView={isOrganizationView} />))}
        </tbody>
      </table>
    </div>
  );
}

RepoTable.defaultProps = {
  data: [],
  isOrganizationView: false,
};

RepoTable.propTypes = {
  data: PropTypes.array,
  removeRepo: PropTypes.func.isRequired,
  isOrganizationView: PropTypes.bool,
};

export default RepoTable;
