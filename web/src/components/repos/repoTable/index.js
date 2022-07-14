import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import styles from './repoTable.module.scss';
import RepoRow from '../repoRow';
import usePermission from '../../../hooks/usePermission';
import { useFlags } from '../../launchDarkly';

function RepoTable({ data, removeRepo, isOrganizationView }) {
  const { isOrganizationAdmin } = usePermission();
  const { repoSyncTab } = useFlags();

  return (
    <div className={clsx('table-container', styles['table-wrapper'])}>
        <table className={clsx('table is-fullwidth', styles.table, isOrganizationAdmin() ? styles['margin-table'] : 'my-25')}>
          <thead className={clsx('is-fullwidth', styles.thead)}>
            <tr>
              <th className="is-uppercase has-text-weight-semibold is-size-8 py-10">Repo</th>
              <th className="is-uppercase has-text-weight-semibold is-size-8 py-10">Languages</th>
              <th className="is-uppercase has-text-weight-semibold is-size-8 py-10 has-text-centered">Sema code reviews</th>
              <th className="is-uppercase has-text-weight-semibold is-size-8 py-10 has-text-centered">Sema comments</th>
              <th className="is-uppercase has-text-weight-semibold is-size-8 py-10 has-text-centered">Sema commenters</th>
              <th className="is-uppercase has-text-weight-semibold is-size-8 py-10 has-text-centered">Sema Users</th>
              {repoSyncTab && <th className="is-uppercase has-text-weight-semibold is-size-8 py-10">Repo Sync Status</th>}
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
