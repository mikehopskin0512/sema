import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import styles from './repoTable.module.scss';
import RepoRow from '../repoRow';
import usePermission from '../../../hooks/usePermission';
import { useFlags } from '../../launchDarkly';

const RepoTable = ({ data, removeRepo, isOrganizationView, search, otherReposCount }) => {
  const { isOrganizationAdmin } = usePermission();
  const { repoSyncTab } = useFlags();

  const renderTableRaw = () => {
    return (<tr className="has-background-gray-300">
      <th className="is-uppercase has-text-weight-semibold is-size-8 pr-10 px-10">Repo</th>
      <th className="is-uppercase has-text-weight-semibold is-size-8 p-10">Languages</th>
      <th className="is-uppercase has-text-weight-semibold is-size-8 p-10 has-text-centered">Sema code reviews</th>
      <th className="is-uppercase has-text-weight-semibold is-size-8 p-10 has-text-centered">Sema comments</th>
      <th className="is-uppercase has-text-weight-semibold is-size-8 p-10 has-text-centered">Sema commenters</th>
      <th className="is-uppercase has-text-weight-semibold is-size-8 p-10 has-text-centered">Sema Users</th>
      {isOrganizationAdmin() && <th aria-label="action-header" />}
    </tr>);
  }

  return (
    <div className={clsx('table-container', styles['table-wrapper'])}>
      {/* <table className={clsx('table is-fullwidth my-25', styles.table)}>
        <tbody className="is-fullwidth mt-25">
          <tr className="has-text-weight-semibold is-size-5"><div className="my-25">{`Pinned repos (${data.pinned.length})`}</div></tr>
          {renderTableRaw()}
          {data.pinned.length ? data.pinned.map((item) => (<RepoRow {...item} key={`guide-${item._id}`} removeRepo={removeRepo} isOrganizationView={isOrganizationView} isPinned={true} />)) : (!search) ? <p className="mt-25">No Pinned Repos yet. Add your first one!</p> : <p className="mt-25">No Results Found. We couldn’t find any match</p>}
          <tr className="has-text-weight-semibold is-size-5 pl-10 pb-25 pt-25"><div className="my-25 ">{`Other repos (${otherReposCount})`}</div></tr>
          {renderTableRaw()}
          {data.other.length ? data.other.map((item) => (<RepoRow {...item} key={`guide-${item._id}`} removeRepo={removeRepo} isOrganizationView={isOrganizationView} isPinned={false} />)) : (!search) ? <p className="mt-25">No Pinned Repos yet. Add your first one!</p> : <p className="mt-25">No Results Found. We couldn’t find any match</p>}
        </tbody>
      </table>
    </div> */}
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
