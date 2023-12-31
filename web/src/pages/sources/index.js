import { useRouter } from 'next/router';
import { forwardRef, useEffect, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { formatDistance } from 'date-fns';
import { ArrowRightIcon, GithubIcon } from '../../components/Icons';
import {
  useTable,
  useSortBy,
  useRowSelect,
} from 'react-table';

import withLayout from '../../components/layout';

import { repositoriesOperations } from '../../state/features/repositories';
import { sourcesOperations } from '../../state/features/sources';
import useAuthEffect from '../../hooks/useAuthEffect';

const { addRepositories } = repositoriesOperations;
const { createSource, fetchSources, fetchSourceRepos } = sourcesOperations;
const githubAppName = process.env.NEXT_PUBLIC_GITHUB_APP_NAME;

const IndeterminateCheckbox = forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = useRef();
    const resolvedRef = ref || defaultRef;

    useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <input type="checkbox" ref={resolvedRef} {...rest} />
    );
  },
);

function Table({ columns, data, auth }) {
  const dispatch = useDispatch();

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    state: { selectedRowIds },
  } = useTable(
    {
      data,
      columns,
    },
    useSortBy,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: 'selection',
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    },
  );

  const addRepos = () => {
    const selectedRepositories = selectedFlatRows.map(
      (d) => d.original,
    );
    dispatch(addRepositories(selectedRepositories, auth.token));
  };

  // Render the UI for your table
  return (
    <div>
      <table {...getTableProps()} className="table is-striped" style={{ width: '75%' }}>
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
      <p>Selected Repositories: {Object.keys(selectedRowIds).length}</p>
      <br />
      <button
        type="button"
        className="button is-black is-flex fa-align-center"
        disabled={Object.keys(selectedRowIds).length === 0}
        onClick={addRepos}>
        <span className="mr-8">Add selected repositories and continue</span>
        <ArrowRightIcon size="small" />
      </button>
    </div>
  );
}

const Sources = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { query: { installation_id: externalSourceId, setup_action: action } } = router;

  // Import Redux vars
  const { auth, sources } = useSelector(
    (state) => ({
      auth: state.authState,
      sources: state.sourcesState,
    }),
  );

  // Get org id from user
  const { user: { organizations = [] } = {}, token } = auth;
  const [firstOrg = {}] = organizations;
  const { id: orgId = null } = firstOrg;

  // Post source if cb
  useAuthEffect(() => {
    if (externalSourceId && action === 'install') {
      const source = {
        orgId, externalSourceId, type: 'github',
      };
      dispatch(createSource(source, token));
    }
  }, [orgId, externalSourceId, action, router]);

  // Fetch sources list
  useAuthEffect(() => {
    if (orgId) {
      dispatch(fetchSources(orgId, token));
    }
  }, [orgId]);

  // Get sources from state
  const { data: sourcesData = [] } = sources;
  // TEMP - for only 1 source
  const firstSource = sourcesData[0] || {};
  const { _id: sourceId } = firstSource;

  // Fetch repos from source
  useAuthEffect(() => {
    if (sourceId) {
      dispatch(fetchSourceRepos(sourceId, token));
    }
  }, [sourceId]);

  // Map source repository data to only needed fields
  const { selectedSourceRepos: repositoriesData = [] } = sources;
  const simpleRepositories = repositoriesData.map((item) => (
    ({
      id: externalId, name,
      created_at: repositoryCreatedAt, updated_at: repositoryUpdatedAt,
      clone_url: cloneUrl,
    }) => (
      {
        externalId,
        name,
        repositoryCreatedAt,
        repositoryUpdatedAt,
        type: 'github',
        orgId,
        sourceId,
        cloneUrl,
      }
    ))(item));

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Created',
        accessor: 'repositoryCreatedAt',
        Cell: ({ cell: { value } }) => ((value) ? formatDistance(new Date(value), new Date(), { addSuffix: true }) : null),
      },
      {
        Header: 'Last Updated',
        accessor: 'repositoryUpdatedAt',
        Cell: ({ cell: { value } }) => ((value) ? formatDistance(new Date(value), new Date(), { addSuffix: true }) : null),
      },
    ],
    [],
  );

  return (
    <div>
      <section className="section">
        <div className="container" style={{ width: '75%' }}>
          <div className="title-topper mt-70 mb-20" />
          <h1 className="title">Add repositories from GitHub</h1>

          {
            (Object.keys(firstSource).length === 0) ? (
              <div>
                <p>First, autorize Sema to access your repositories from GitHub.</p>
                <br />
                <a
                  type="button"
                  className="button is-github"
                  href={`https://github.com/apps/${githubAppName}/installations/new`}>
                  <span className="icon">
                    <GithubIcon size="small" />
                  </span>
                  <span>Add repositories from GitHub</span>
                </a>
              </div>
            )
              :
              <p>You are currently connected to {firstSource.type}. Your available repositories are shown below.</p>
          }

          <div className="title-topper mt-70 mb-20" />
          <h1 className="title">Repositories available for import</h1>
          {/* Data table */}
          <Table columns={columns} data={simpleRepositories} auth={auth} />
        </div>
      </section>
    </div>
  );
};

export default withLayout(Sources);
