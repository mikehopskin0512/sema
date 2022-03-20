import React, { useState } from 'react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { OptionsIcon } from '../../../../components/Icons';
import DropDownMenu from '../../../../components/dropDownMenu';
import Table from '../../../../components/table';
import AddSnapshotModal from '../../../../components/portfolios/addSnapshotModal';

const snapshotList = () => {
  // const dispatch = useDispatch();
  const { snapshotsState } = useSelector((state) => state);
  const {
    data: { snapshots },
  } = snapshotsState;
  const [snapshotIdForPortfolio, setSnapshotIdForPortfolio] = useState('');
  const isModalActive = !!snapshotIdForPortfolio;

  const tableData = snapshots.map((snapshot, i) => ({
    id: snapshot._id,
    // TODO: will be fixed in portfolio name ticket
    title: `Snapshot ${i}`,
    updatedAt: format(new Date(snapshot.updatedAt), 'MMM dd, yyyy'),
  }));

  const columns = [
    {
      Header: '',
      isVisible: false,
      accessor: 'id',
      className: 'is-hidden',
    },
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
                onClick={() => setSnapshotIdForPortfolio(row.values.id)}
                type="button"
                className="button is-transparent"
              >+ Add to Portfolio
              </button>
            </div>
            {/* TODO: fix menu */}
            <DropDownMenu
              isRight
              options={[
                {
                  label: 'Duplicate Portfolio',
                  onClick: () => console.log('TODO: will be implement later'),
                },
                {
                  label: 'Save as PDF',
                  onClick: () => console.log('TODO: will be implement later'),
                },
                // TODO: delete function
                { label: 'Delete', onClick: () => console.log(1) },
              ]}
              trigger={
                <div className="is-clickable is-flex mr-20">
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
        data={tableData}
        columns={columns}
      />
      {isModalActive && (
        <AddSnapshotModal
          active={isModalActive}
          snapshotId={snapshotIdForPortfolio}
          onClose={() => setSnapshotIdForPortfolio(null)}
        />
      )}
      {/*type="snapshots" type="portfolios"*/}
    </div>
  );
};

export default snapshotList;
