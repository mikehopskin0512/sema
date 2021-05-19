import { useRowSelect, useSortBy, useTable } from 'react-table';

const Table = ({ columns, data, auth }) => {
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
                  column.sorted === false ? [{ className: column.className }] : [
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
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps([
                      {
                        className: cell.column.className,
                        style: cell.column.style,
                      }])}>{cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            },
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
