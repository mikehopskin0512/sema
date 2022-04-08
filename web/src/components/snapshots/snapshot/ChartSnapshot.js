import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { removeSnapshotsFromPortfolio } from '../../../state/features/portfolios/actions';
import styles from './snapshot.module.scss';
import SnapshotChartContainer from '../snapshotChartContainer';
import { OptionsIcon } from '../../Icons';
import DropDownMenu from '../../dropDownMenu';
import SnapshotModal from '../modalWindow';
import DeleteModal from '../deleteModal';

const ChartSnapshot = ({ snapshotData, portfolioId }) => {
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

  return (
    <>
      <SnapshotModal
        active={isEditModalOpen}
        onClose={() => toggleEditModal(false)}
        snapshotData={snapshotData}
        type="edit"
        dataType={componentType}
      />
      <DeleteModal
        isModalActive={isDeleteModalOpen}
        toggleModalActive={toggleDeleteModal}
        onSubmit={() => onDeleteSnapshot()}
      />
      <div className={clsx(styles.snapshot, 'has-background-gray-200 p-25 mb-30 is-relative')}>
        <div className="is-pulled-right mb-40">
          <DropDownMenu
            isRight
            options={[
              { label: 'Edit Snapshot', onClick: () => toggleEditModal(true) },
              { label: 'Delete Snapshot', onClick: () => toggleDeleteModal(true) },
            ]}
            trigger={(
              <div className="is-clickable is-flex">
                <OptionsIcon />
              </div>
            )}
          />
        </div>
        <div className="is-multiline mt-25">
          <div className={clsx(styles['wrapper'])}>
            <div className={clsx(styles['description-container'])}>
              <div className="is-size-5 has-text-weight-semibold">{title}</div>
              <div>{description}</div>
            </div>
            <div className={clsx(styles['chart-container'])}>
              <div className="is-flex is-flex-wrap-wrap mt-10 p-25 has-background-gray-300">
                {renderComponentSnapshot(componentType)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

ChartSnapshot.propTypes = {
  snapshotData: PropTypes.object.isRequired,
  portfolioId: PropTypes.string.isRequired,
};

export default ChartSnapshot;
