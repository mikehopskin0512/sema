import React from 'react';
import { ELEM_TYPES } from './constants';
import DashboardColumn from './dashboardColumn';
import clsx from 'clsx';
import styles from '../portfoliosDashboard.module.scss';
import DropZone from './dropZone';

const DashboardRow = ({
  data,
  handleDrop,
  path,
  handleSnapshotUpdate,
  onSnapshotDirectionUpdate,
  isPdfView,
  isPortfolioOwner,
}) => {
  const renderColumn = (data, path, isPdfView) => {
    const isHorizontalComment = (data?.isHorizontal) &&  data?.componentType === 'comments';
    return (
      <section className={clsx(styles['draggable-item-wrap'], isHorizontalComment && styles['draggable-item-wrap-horizontal'])}>
        <DropZone
          className='verticalDrag'
          acceptableItems={[ELEM_TYPES.COLUMN]}
          data={{
            path,
          }}
          onDrop={handleDrop}
        />
        <DashboardColumn
          path={path}
          data={data}
          onUpdate={handleSnapshotUpdate}
          onSnapshotDirectionUpdate={onSnapshotDirectionUpdate}
          isPdfView={isPdfView}
          isPortfolioOwner={isPortfolioOwner}
        />
      </section>
    );
  };

  const renderContent = () => {
      return data.children?.map((column, index) => {
        const currentPath = `${path}-${index}`;
        return (
          <React.Fragment key={column.id}>
            {renderColumn(column, currentPath, isPdfView)}
          </React.Fragment>
        );
      });
  };

  return (
    <div className={clsx('columns dashboard-columns', styles['draggable-columns'])}>
      {renderContent()}
    </div>
  )
};
export default DashboardRow;
