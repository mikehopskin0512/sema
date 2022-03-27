import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { OptionsIcon } from '../../../../components/Icons';
import DropDownMenu from '../../../../components/dropDownMenu';
import Table from '../../../../components/table';
import AddSnapshotModal, { ADD_SNAPSHOT_MODAL_TYPES } from '../../../../components/portfolios/addSnapshotModal';
import { CloseIcon, AlertFilledIcon, CheckFilledIcon } from '../../../../components/Icons';
import toaster from 'toasted-notes';
import router from 'next/router';

const snapshotList = () => {
  const showNotification = (isError, path) => {
    toaster.notify(({ onClose }) => (
      <div className={clsx('message  shadow mt-60', isError ? 'is-red-500' : 'is-success')}>
        <div className="message-body has-background-white is-flex">
          {isError ?
            <AlertFilledIcon size="small" /> :
            <CheckFilledIcon size="small" />
          }
          <div>
            <div className="is-flex is-justify-content-space-between mb-15">
              <span className="is-line-height-1 has-text-weight-semibold has-text-black ml-8">
                {isError ? 'Snapshot was not added.' : 'Snapshot was added to your portfolio'}
              </span>
              <div onClick={onClose}>
                <CloseIcon size="small" />
              </div>
            </div>
            {!isError && <div 
              className="has-text-info is-clickable is-underlined" 
              onClick={() => {
                router.push(path);
                onClose();
              }}
            >
              View portfolio
            </div>}
          </div>
        </div>
      </div>
    ), {
      position: 'top-right',
      duration: isError ? 3000 : null,
    });
  };
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
      <AddSnapshotModal
        active={isModalActive}
        snapshotId={snapshotIdForPortfolio}
        onClose={() => setSnapshotIdForPortfolio(null)}
        showNotification={showNotification}
        type={ADD_SNAPSHOT_MODAL_TYPES.PORTFOLIOS}
      />
    </div>
  );
};

export default snapshotList;
