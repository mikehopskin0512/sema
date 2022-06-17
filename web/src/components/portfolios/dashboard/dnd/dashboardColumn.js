import React, { useMemo, useRef } from 'react';
import { useDrag } from 'react-dnd';
import { COMPONENTS_TYPES, ELEM_TYPES } from './constants';
import useResizeObserver from 'use-resize-observer';
import { getDraggableComponent } from './helpers';
import { dndBg, dndBorder } from '../../../../../styles/_colors.module.scss';

const style = {};
const DashboardColumn = ({
  data,
  path,
  onUpdate,
  onSnapshotDirectionUpdate,
  isPdfView,
  isPortfolioOwner
}) => {
  const ref = useRef(null);
  const {
    ref: wrapperRef,
    width = 1,
    height = 1,
  } = useResizeObserver();

  const [{ isDragging }, drag, preview] = useDrag({
    item: {
      type: ELEM_TYPES.COLUMN,
      id: data.id,
      data,
      path,
    },
    type: ELEM_TYPES.COLUMN,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(ref);

  const {
    componentToRender,
    componentProps,
  } = data;

  const opacity = useMemo(() => isDragging ? 0 : 1, [isDragging]);

  const componentsStyles = useMemo(() => isDragging ? {
    position: 'fixed',
    top: 0,
  } : {}, [isDragging]);

  const ComponentToRender = getDraggableComponent(componentToRender);

  if (!data || !ComponentToRender || (componentToRender === COMPONENTS_TYPES.EMPTY && isPdfView)) return null;

  return (
    <>
      {isDragging && <div style={{
        width,
        height,
        border: `1px dashed ${dndBorder}`,
        background: dndBg
      }} />}
      <div
        ref={wrapperRef}
        className='column p-0'
        style={{
          ...style,
          ...componentsStyles,
          opacity,
        }}
      >
        <ComponentToRender
          {...componentProps}
          ref={ref}
          preview={preview}
          isDragging={isDragging}
          onUpdate={onUpdate}
          onSnapshotDirectionUpdate={onSnapshotDirectionUpdate}
          path={path}
          isOwner={isPortfolioOwner}
        />
      </div>
    </>
  );
};
export default DashboardColumn;
