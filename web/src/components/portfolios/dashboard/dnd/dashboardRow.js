import React, { useMemo, useRef } from 'react';
import { useDrag } from 'react-dnd';
import { COMPONENTS_TYPES, ELEM_TYPES } from './constants';
import DashboardColumn from './dashboardColumn';
import clsx from 'clsx';
import styles from '../portfoliosDashboard.module.scss';
import DropZone from './dropZone';
import useResizeObserver from 'use-resize-observer';
import { getDraggableComponent } from './helpers';
import { dndBg, dndBorder } from '../../../../../styles/_colors.module.scss';

const DashboardRow = ({
  data,
  handleDrop,
  path,
  handleSnapshotUpdate,
  onSnapshotDirectionUpdate,
  snapshots,
  isPdfView,
  isPortfolioOwner,
}) => {
  const ref = useRef(null);
  const {
    ref: wrapperRef,
    width = 1,
    height = 1,
  } = useResizeObserver();

  const [{ isDragging }, drag, preview] = useDrag({
    type: ELEM_TYPES.ROW,
    item: {
      id: data.id,
      type: ELEM_TYPES.ROW,
      path,
      data,
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(ref);

  const rowOpacity = useMemo(() => isDragging ? 0 : 1, [isDragging]);

  const renderColumn = (data, path, isPdfView) => {
    return (
      <section className={styles['chart-wrap']}>
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
    if (data.isIndependent) {
      const {
        componentToRender,
        componentProps,
      } = data;
      const fallbackData = snapshots.find(i => i._id === data?.data?._id);
      const props = {
        ...componentProps,
        snapshotData: {
          ...componentProps.snapshotData,
          title: fallbackData?.title,
          description: fallbackData?.description,
          isHorizontal: fallbackData?.isHorizontal,
        },
      };

      const ComponentToRender = getDraggableComponent(componentToRender);
      return (componentToRender === COMPONENTS_TYPES.EMPTY && isPdfView) ? null :
        <ComponentToRender
          {...props}
          ref={ref}
          preview={preview}
          onUpdate={handleSnapshotUpdate}
          onSnapshotDirectionUpdate={onSnapshotDirectionUpdate}
          isOwner={isPortfolioOwner}
        />;
    } else {
      return data.children?.map((column, index) => {
        const currentPath = `${path}-${index}`;
        return (
          <React.Fragment key={column.id}>
            {renderColumn(column, currentPath, isPdfView)}
          </React.Fragment>
        );
      });
    }
  };

  return data.isIndependent ? (
    <>
      {isDragging && <div style={{
        width,
        height,
        border: `1px dashed ${dndBorder}`,
        background: dndBg,
      }} />}
      <div ref={ref} style={{
        opacity: rowOpacity,
      }} className='base draggable row'>
        <div className={clsx('columns dashboard-columns', styles['draggable-columns'])} ref={wrapperRef}>
          {renderContent()}
        </div>
      </div>
    </>
  ) : (
    <div className={clsx('columns dashboard-columns', styles['draggable-columns'])}>
      {renderContent()}
    </div>
  );
};
export default DashboardRow;
