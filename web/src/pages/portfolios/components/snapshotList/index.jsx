import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { OptionsIcon } from '../../../../components/Icons';
import DropDownMenu from '../../../../components/dropDownMenu';
import Table from '../../../../components/table';
import AddSnapshotModal, { ADD_SNAPSHOT_MODAL_TYPES } from '../../../../components/portfolios/addSnapshotModal';
import { CloseIcon, AlertFilledIcon, CheckFilledIcon } from '../../../../components/Icons';
import toaster from 'toasted-notes';
import router from 'next/router';
import DeleteSnapshot from '../../../../components/snapshots/deleteModal';
import SnapshotModal from '../../../../components/snapshots/modalWindow';
import { snapshotsOperations } from '../../../../state/features/snapshots';
import { deleteUserSnapshot } from '../../../../state/features/snapshots/actions';
import styles from '../../portfolios.module.scss';

const { duplicateSnapshot } = snapshotsOperations;

const snapshotList = () => {
  const showNotification = (isError, path) => {
    //ToDo: change this for new notification component after ETCR-1086 will be merged
    toaster.notify(({ onClose }) => (
      <div className={clsx('message  shadow mt-60', isError ? 'is-red-500' : 'is-success')}>
        <div className="message-body has-background-white is-flex">
          {isError ?
            <AlertFilledIcon size="small" /> :
            <CheckFilledIcon size="small" />
          }
          <div>
            <div className="is-flex is-justify-content-space-between">
              <span className="is-line-height-1 has-text-weight-semibold has-text-black ml-8">
                {isError ? 'Snapshot was not added.' : 'Snapshot was added succesfully.'}
              </span>
              <div className="ml-30" onClick={onClose}>
                <CloseIcon size="small" />
              </div>
            </div>
            {!isError && <div
              className="has-text-info is-clickable is-underlined"
              onClick={() => {
                onClose();
                router.push(path);
              }}
            >
              View portfolio
            </div>}
          </div>
        </div>
      </div>
    ), {
      position: 'top-right',
      duration: 3000,
    });
  };
  const [snapshotIdForPortfolio, setSnapshotIdForPortfolio] = useState('');
  const isModalActive = !!snapshotIdForPortfolio;
  const dispatch = useDispatch();
  const [editingSnapshot, setEditingSnapshot] = useState(null);
  const [isDeleteModal, setDeleteModal] = useState(false);
  const [selectedSnapshot, setSelectedSnapshot] = useState(null);
  const { snapshotsState, authState } = useSelector((state) => state);
  const isEditModalOpen = editingSnapshot !== null;
  const clearEditingSnapshot = () => setEditingSnapshot(null);

  const {
    data: { snapshots },
  } = snapshotsState;
  const { token } = authState;

  const deleteSnapshot = (id, token) => {
    dispatch(deleteUserSnapshot(id, token));
    setDeleteModal(false);
  };

  const toggleDeleteModal = (info) => {
    setDeleteModal(!isDeleteModal);
    setSelectedSnapshot(isDeleteModal ? null : info);
  };

  const tableData = snapshots.map((snapshot, i) => ({
    id: snapshot._id,
    // TODO: will be fixed in portfolio name ticket
    title: snapshot.title,
    updatedAt: format(new Date(snapshot.updatedAt), 'MMM dd, yyyy'),
    snapshotId: snapshot._id,
    portfoliosAmount: snapshot.portfolios?.length,
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
        const { portfoliosAmount, snapshotId } = row.original;

        return (
          <div className="is-flex is-justify-content-flex-end">
            <div
              className={clsx("is-flex mr-20", isPublic && "is-cursor-pointer")}
            >
              <button
                onClick={() => setSnapshotIdForPortfolio(row.values.id)}
                type="button"
                className="button is-transparent has-text-weight-semibold"
              >
                Add to Portfolio
              </button>
            </div>
            {/* TODO: fix menu */}
            <DropDownMenu
              isRight
              options={[
                {
                  label: 'Edit',
                  onClick: () => setEditingSnapshot(snapshots[row.index])
                },
                {
                  label: 'Duplicate',
                  onClick: () => {
                    const snapshot = snapshots[row.index];
                    dispatch(duplicateSnapshot(snapshot, token));
                  }
                },
                // TODO: delete function
                {
                  label: 'Delete',
                  onClick: () =>
                    toggleDeleteModal({
                      snapshotId,
                      portfoliosAmount,
                    }),
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
      <DeleteSnapshot
        isModalActive={isDeleteModal}
        toggleModalActive={setDeleteModal}
        bodyContent={
          <section>
            <span className="has-text-red-600">Attention!</span> This Snapshot
            appears in {selectedSnapshot?.portfoliosAmount ?? 0} portfolios.
            Deleting the Snapshot will permanently remove it from all
            portfolios.
          </section>
        }
        onSubmit={() => deleteSnapshot(selectedSnapshot?.snapshotId, token)}
        bodyPaddings="pl-40 pr-40 pb-40 pt-25"
        headerClass={styles["snapshots-modal-header"]}
        additionalWrapperClass={styles["snapshots-modal-wrapper"]}
        titleClass={styles["snapshots-modal-title"]}
        crossClass={styles["snapshots-modal-cross"]}
      />
      <SnapshotModal
        key={editingSnapshot?._id}
        active={isEditModalOpen}
        onClose={clearEditingSnapshot}
        snapshotData={editingSnapshot}
        type="edit"
      />
    </div>
  );
};

export default snapshotList;
