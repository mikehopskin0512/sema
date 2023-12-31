import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { removeSnapshotsFromPortfolio } from '../../../state/features/portfolios/actions';
import styles from './snapshot.module.scss';
import SnapshotChartContainer from '../snapshotChartContainer';
import { DragTriggerIcon, OptionsIcon } from '../../Icons';
import DropDownMenu from '../../dropDownMenu';
import SnapshotModal from '../modalWindow';
import DeleteModal from '../deleteModal';
import { snapshotsOperations } from '../../../state/features/snapshots';
import MarkdownEditor from '../../markdownEditor';
import { gray600 } from '../../../../styles/_colors.module.scss';

const { duplicateSnapshot } = snapshotsOperations;

const ChartSnapshot = React.forwardRef(({
  snapshotData,
  portfolioId,
  preview,
  spaced,
  isOwner,
  onUpdate,
  onSnapshotDirectionUpdate,
  isDragging
}, ref) => {
  const dispatch = useDispatch();
  const { auth } = useSelector(
    (state) => ({
      auth: state.authState,
    }),
  );
  const { token } = auth;
  const { _id: snapshotId = '', title, description, componentType, componentData = { smartComments: [] } } = snapshotData
  const [isEditModalOpen, toggleEditModal] = useState(false);
  const [isDeleteModalOpen, toggleDeleteModal] = useState(false);

  const renderComponentSnapshot = (type) => {
    if (componentData) {
      switch (type) {
      case 'summaries-area':
        return (<SnapshotChartContainer chartType="reactions-area" {...componentData} />);
      case 'summaries':
        return (<SnapshotChartContainer chartType="reactions" {...componentData} />);
      case 'tags':
        return (<SnapshotChartContainer chartType="tags" {...componentData} />);
      default:
        return '';
      }
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
        type='edit'
        dataType={componentType}
      />
      <DeleteModal
        isModalActive={isDeleteModalOpen}
        toggleModalActive={toggleDeleteModal}
        onSubmit={() => onDeleteSnapshot()}
      />
      <div
        className={clsx(styles.snapshot, styles['chart-snapshot'], 'has-background-gray-200 p-25 is-relative chart-snapshot', spaced && 'mr-16', isDragging && styles['snapshot-dragging'])}
        ref={preview}>
        {isOwner && <div className={clsx("is-pulled-right mb-40 is-flex is-align-items-baseline mr-0", styles['container-buttons-wrapper'])}>
          <DropDownMenu
            isRight
            options={[
              {
                label: 'Duplicate Snapshot',
                onClick: () => {
                  dispatch(duplicateSnapshot(snapshotData, token));
                },
              },
              { label: 'Edit Snapshots', onClick: () => toggleEditModal(true) },
              { label: 'Delete Snapshots', onClick: () => toggleDeleteModal(true) },
            ]}
            trigger={(
              <div className={clsx("is-clickable is-flex", isOwner && "mr-40")}>
                <OptionsIcon color={gray600} />
              </div>
            )}
          />
          {isOwner && (
            <div ref={ref} className={clsx(styles['draggable-container'], "mr-0")}>
              <DragTriggerIcon />
            </div>
          )}
        </div>}
        <div className="is-multiline mt-10 mr-0">
          <div className={clsx(styles['wrapper'])}>
            <div className={clsx(styles['description-container'])}>
              <div className="is-size-5 has-text-weight-semibold">{title}</div>
              <div className="mb-25">
                <MarkdownEditor readOnly={true} value={description} />
              </div>
            </div>
            <div className={clsx(styles['chart-container'])}>
              <div className="is-flex is-flex-wrap mt-10 p-25 has-background-gray-300 mr-0">
                {renderComponentSnapshot(componentType)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

ChartSnapshot.propTypes = {
  snapshotData: PropTypes.object.isRequired,
  portfolioId: PropTypes.string.isRequired,
  isOwner: PropTypes.bool,
};

ChartSnapshot.defaultProps = {
  isOwner: true,
};

export default ChartSnapshot;
