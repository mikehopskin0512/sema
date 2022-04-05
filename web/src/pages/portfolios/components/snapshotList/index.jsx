import React, { useState } from 'react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { OptionsIcon } from '../../../../components/Icons';
import DropDownMenu from '../../../../components/dropDownMenu';
import Table from '../../../../components/table';
import DeleteSnapshot from '../../../../components/snapshots/deleteModal';
import { deleteUserSnapshot } from '../../../../state/features/snapshots/actions';
import styles from '../../portfolios.module.scss';

const snapshotList = () => {
  const dispatch = useDispatch();

  const [isDeleteModal, setDeleteModal] = useState(false);
  const [selectedSnapshot, setSelectedSnapshot] = useState(null);
  const { snapshotsState, authState } = useSelector((state) => state);

  const {
    data: { snapshots },
  } = snapshotsState;
  const { token } = authState;

  const addToPortfolio = () => {
    //  TODO: add to portfolio
  };

  const deleteSnapshot = (id, token) => {
    dispatch(deleteUserSnapshot(id, token));
    setDeleteModal(false);
  };

  const toggleDeleteModal = (info) => {
    setDeleteModal(!isDeleteModal);
    setSelectedSnapshot(isDeleteModal ? null : info);
  };

  const tableData = snapshots.map((snapshot) => ({
    title: snapshot.title,
    updatedAt: format(new Date(snapshot.updatedAt), 'MMM dd, yyyy'),
    snapshotId: snapshot._id,
    portfoliosAmount: snapshot.portfolios?.length,
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
        const { portfoliosAmount, snapshotId } = row.original;

        return (
          <div className="is-flex is-justify-content-flex-end">
            <div
              className={clsx("is-flex mr-20", isPublic && "is-cursor-pointer")}
            >
              <button
                onClick={addToPortfolio}
                type="button"
                className="button is-transparent has-text-weight-semibold"
              >
                Add to Portfolio
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
    </div>
  );
};

export default snapshotList;
