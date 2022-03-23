import React from 'react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { OptionsIcon } from '../../../../components/Icons';
import DropDownMenu from '../../../../components/dropDownMenu';
import Table from '../../../../components/table';

const snapshotList = () => {
  // const dispatch = useDispatch();
  const { snapshotsState } = useSelector((state) => state);
  const {
    data: { snapshots },
  } = snapshotsState;
  const addToPortfolio = () => {
  //  TODO: add to portfolio
  };

  const tableData = snapshots.map((snapshot) => ({
    title: snapshot.title,
    updatedAt: format(new Date(snapshot.updatedAt), 'MMM dd, yyyy'),
  }));

  const columns = [
    {
      Header: 'Title',
      accessor: 'title',
      className: 'p-16 has-text-weight-semibold',
    },
    {
      Header: 'Date of last change',
      accessor: 'updatedAt',
      className: 'p-16',
    },
    {
      Header: '',
      isVisible: false,
      accessor: 'action',
      className: 'pl-20 py-10 has-background-white-50',
      Cell: ({ row }) => {
        const isPublic = row.values.type === 'public';
        return (
          <div className="is-flex is-justify-content-flex-end">
            <div className={clsx(
              'is-flex mr-20',
              isPublic && 'is-cursor-pointer',
            )}>
              <button
                onClick={addToPortfolio}
                type="button"
                className="button is-transparent has-text-weight-semibold"
              >Add to Portfolio
              </button>
            </div>
            <DropDownMenu
              isRight
              options={[
                {
                  // TODO: Edit function
                  label: 'Edit',
                  onClick: () => console.log('TODO: will be implement later'),
                },
                {
                  // TODO: Duplicate function
                  label: 'Duplicate',
                  onClick: () => console.log('TODO: will be implement later'),
                },
                // TODO: delete function
                {
                  label: 'Delete',
                  onClick: () => console.log('TODO: will be implement later')
                },
              ]}
              trigger={
                <div className="is-clickable is-flex mr-20 p-8 has-text-gray-600">
                  <OptionsIcon />
                </div>
              }
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="mt-32">
      <div className="is-flex is-justify-content-space-between">
        <p className="title is-size-4">Snapshot Library</p>
      </div>
      <Table
        minimal
        className="overflow-unset shadow-none"
        data={tableData}
        columns={columns}
      />
    </div>
  );
};

export default snapshotList;
