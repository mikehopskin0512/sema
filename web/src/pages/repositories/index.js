import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { formatDistance } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  useTable,
  useFilters,
  useSortBy,
  useRowSelect,
  usePagination,
} from 'react-table';

import Toaster from '../../components/toaster';
import withLayout from '../../components/layout';
import { alertOperations } from '../../state/features/alerts';
import { repositoriesOperations } from '../../state/features/repositories';

const { clearAlert } = alertOperations;
const { fetchRepos, addAnalysis } = repositoriesOperations;

function Table({ columns, data, auth }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      data,
      columns,
    },
    useSortBy,
    useRowSelect,
  );

  // Render the UI for your table
  return (
    <div>
      <table {...getTableProps()} className="table is-striped" style={{ width: '100%' }}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(
                  [
                    column.getSortByToggleProps(),
                    { className: column.className },
                  ],
                )}>
                  {column.render('Header')}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(
            (row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (<td {...cell.getCellProps([
                      {
                        className: cell.column.className,
                        style: cell.column.style,
                      }])}>{cell.render('Cell')}
                    </td>);
                  })}
                </tr>
              );
            },
          )}
        </tbody>
      </table>
    </div>
  );
}

const Repos = () => {
  const dispatch = useDispatch();

  // Import Redux vars
  const { alerts, auth, repositories } = useSelector(
    (state) => ({
      alerts: state.alertsState,
      auth: state.authState,
      repositories: state.repositoriesState,
    }),
  );

  // Get org id from user
  const { user: { organizations = [] } = {} } = auth;
  const [firstOrg = {}] = organizations;
  const { id: orgId = null } = firstOrg;

  // Show alerts from state
  const { showAlert, alertType, alertLabel } = alerts;
  useEffect(() => {
    if (showAlert === true) {
      dispatch(clearAlert());
    }
  }, [showAlert, dispatch]);

  // Fetch repos
  useEffect(() => {
    if (auth.token) {
      dispatch(fetchRepos(orgId, auth.token));
    }
  }, [dispatch, orgId, auth.token]);

  // Get repositories from state
  const { data: repositoriesList = [] } = repositories;

  const onAnalysisPress = (repoId) => {
    dispatch(addAnalysis(repoId, auth.token));
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Added',
        accessor: 'createdAt',
        Cell: ({ cell: { value } }) => ((value) ? formatDistance(new Date(value), new Date(), { addSuffix: true }) : null),
      },
      {
        Header: 'Last Injestion Run',
        accessor: '',
        Cell: ({ cell: { value } }) => ((value) ? formatDistance(new Date(value), new Date(), { addSuffix: true }) : 'TBD'),
      },
      {
        Header: () => <div style={{ textAlign: 'center' }}>Actions</div>,
        accessor: '_id',
        Cell: ({ cell: { value } }) => (
          <div style={{ textAlign: 'center' }}>
            <button type="button" onClick={() => { onAnalysisPress(value); }}>Launch Analysis</button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div>
      <Toaster
        type={alertType}
        message={alertLabel}
        showAlert={showAlert} />
      <section className="section">
        <div className="container" style={{ width: '75%' }}>
          <div className="columns mt-70">
            <div className="column">
              <div className="title-topper mb-20" />
              <h1 className="title">Repositories</h1>
            </div>
            <div className="column has-text-right">
              <Link href="/sources">
                <a className="button is-primary">
                  <span className="icon">
                    <FontAwesomeIcon icon={['fas', 'plus']} />
                  </span>
                  <span>Import repositories</span>
                </a>
              </Link>
            </div>
          </div>
          <br />
          {/* Data table */}
          <Table columns={columns} data={repositoriesList} auth={auth} />
          {(repositoriesList.length === 0) && (
            <div className="has-text-centered mt-50">
              <p className="subtitle is-5">No repositories available. Import some using the button above.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default withLayout(Repos);
