import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { removeSnapshotsFromPortfolio } from '../../../state/features/portfolios/actions';
import styles from './snapshot.module.scss';
import ActivityItem from '../../activity/item';
import { DragTriggerIcon, OptionsIcon } from "../../Icons";
import DropDownMenu from '../../dropDownMenu';
import SnapshotModal from '../modalWindow';
import DeleteModal from '../deleteModal';
import { snapshotsOperations } from '../../../state/features/snapshots';

const { duplicateSnapshot } = snapshotsOperations;

const CommentSnapshot = React.forwardRef(({ snapshotData, portfolioId, preview, isOwner, onUpdate }, ref) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.authState);
  const { _id: snapshotId = '', userId, title, description, componentType, componentData = { smartComments: [] } } = snapshotData
  const [isEditModalOpen, toggleEditModal] = useState(false);
  const [isDeleteModalOpen, toggleDeleteModal] = useState(false);

  const renderCommentSnapshot = () => {
    if (componentData) {
      return componentData.smartComments?.map((d) => <ActivityItem {...d} className='is-full-width my-10' isSnapshot />);
    }
    return '';
  };

  const onDeleteSnapshot = async () => {
    dispatch(removeSnapshotsFromPortfolio(portfolioId, [snapshotId], token));
    toggleDeleteModal(false);
  };

  const handleSnapshotUpdate = (data) => {
    toggleEditModal(false);
    if(data) {
      onUpdate(data);
    }
  }

  return (
    <>
      <SnapshotModal
        active={isEditModalOpen}
        onClose={handleSnapshotUpdate}
        snapshotData={snapshotData}
        type="edit"
        dataType={componentType}
      />
      <DeleteModal
        isModalActive={isDeleteModalOpen}
        toggleModalActive={toggleDeleteModal}
        onSubmit={() => onDeleteSnapshot()}
      />
      <div className={clsx(styles.snapshot, 'has-background-gray-200 p-25 mb-30 is-relative')} ref={preview}>
        {isOwner && <div className={clsx("is-pulled-right mb-40 is-flex is-align-items-baseline", styles['container-buttons-wrapper'])}>
          <DropDownMenu
            isRight
            options={[
              {
                label: 'Duplicate Snapshot',
                onClick: () => {
                  dispatch(duplicateSnapshot(snapshotData, token));
                }
              },
              { label: 'Edit Snapshots', onClick: () => toggleEditModal(true) },
              { label: 'Delete Snapshots', onClick: () => toggleDeleteModal(true) },
            ]}
            trigger={(
              <div className="is-clickable is-flex mr-40">
                <OptionsIcon />
              </div>
            )}
          />
          <div ref={ref} className={styles['draggable-container']}>
            <DragTriggerIcon />
          </div>
        </div>}
        <div className={clsx('columns is-multiline mt-10 sema-is-boxed', styles['comments-snap-content'])}>
          <div className={clsx('column is-full pt-0')}>
            <div className="is-size-5 has-text-weight-semibold">{title}</div>
            <div>{description}</div>
          </div>
          <div className={clsx('column is-full')}>
            <div className="is-flex is-flex-wrap-wrap mt-10 p-25 has-background-gray-300">
              {renderCommentSnapshot()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

CommentSnapshot.propTypes = {
  snapshotData: PropTypes.object.isRequired,
  portfolioId: PropTypes.string.isRequired,
  isOwner: PropTypes.bool,
};

CommentSnapshot.defaultProps = {
  isOwner: true,
};

export default CommentSnapshot;
