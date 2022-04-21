import React, { useMemo, useRef } from "react";
import { useDrag } from "react-dnd";
import { ELEM_TYPES } from "./constants";
import DashboardColumn from "./dashboardColumn";
import clsx from "clsx";
import styles from "../portfoliosDashboard.module.scss";
import DropZone from "./dropZone";
import useResizeObserver from "use-resize-observer";
import { getDraggableComponent } from "./helpers";
import { dndBorder, dndBg } from '../../../../../styles/_colors.module.scss';

const DashboardRow = ({
  data,
  handleDrop,
  path,
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

  const renderColumn = (data, path) => {
    return (
      <section className={clsx(styles["chart-wrap"])}>
        <DropZone
          className='verticalDrag'
          acceptableItems={[ELEM_TYPES.COLUMN]}
          data={{
            path,
          }}
          onDrop={handleDrop}
        />
        <DashboardColumn path={path} data={data} />
      </section>
    );
  };

  const renderContent = () => {
    if (data.isIndependent) {
      const {
        componentToRender,
        componentProps,
      } = data;
      const ComponentToRender = getDraggableComponent(componentToRender);
      return <ComponentToRender {...componentProps} ref={ref} preview={preview} />;
    } else {
      return data.children?.map((column, index) => {
        const currentPath = `${path}-${index}`;
        return (
          <React.Fragment key={column.id}>
            {renderColumn(column, currentPath)}
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
        background: dndBg
      }} />}
      <div ref={ref} style={{
        opacity: rowOpacity,
      }} className='base draggable row'>
        <div className='columns' ref={wrapperRef}>
          {renderContent()}
        </div>
      </div>
    </>
  ) : (
    <div className='columns'>
      {renderContent()}
    </div>
  );
};
export default DashboardRow;
