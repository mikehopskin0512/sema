import React from 'react';
import PropTypes from 'prop-types';
import {
  useTable,
  useSortBy,
  useRowSelect,
} from 'react-table';

const UserTable = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
  } = useTable(
    {
      data,
      columns,
    },
    useSortBy,
    useRowSelect,
  );

  return (
    <div>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <table {...getTableProps()} className="table" style={{ width: '100%' }}>
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
                  {column.render('Header', column)}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(
            (row, i) => {
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

UserTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
};
export default UserTable;
