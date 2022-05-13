import React, { useCallback, useEffect, useState } from 'react';
import DropZone from './dropZone';
import DashboardRow from './dashboardRow';
import { ACCEPTABLE_ITEMS, DND_CASES_CHECKS } from './constants';
import {
  changeChildDirection,
  createAdditionalItemsRow,
  reorderChildInRow,
  reorderIndependentRow,
  replaceChildInAnotherParent,
} from './manipulations';

const DashboardDraggableList = ({
  pageLayout,
  updateLayout,
  handleSnapshotUpdate,
  onSnapshotDirectionUpdate,
  snapshots,
  isPdfView,
  isPortfolioOwner,
}) => {
  const [layout, setLayout] = useState([]);

  useEffect(() => {
    if (pageLayout) {
      setLayout(pageLayout);
    }
  }, [pageLayout]);

  const handleDrop = useCallback(
    (dropZone, item) => {
      const itemPath = item.path;

      const splitDropZonePath = dropZone.path.split('-');
      const splitItemPath = itemPath.split('-');

      const updater = (data) => {
        setLayout(data);
        updateLayout(data);
      };

      if (DND_CASES_CHECKS.SAME_ROW_ITEMS(splitItemPath, splitDropZonePath)) {
        return reorderChildInRow({
          index: splitItemPath[0],
          oldPosition: splitItemPath,
          newPosition: splitDropZonePath,
          currentLayout: layout,
          updater,
        });
      }
      if (DND_CASES_CHECKS.DIFF_ROWS_ITEMS(splitItemPath, splitDropZonePath)) {
        return createAdditionalItemsRow({
          oldPosition: splitItemPath,
          newPosition: splitDropZonePath,
          currentLayout: layout,
          itemToSet: item,
          updater,
        });
      }
      return replaceChildInAnotherParent({
        oldPosition: splitItemPath,
        newPosition: splitDropZonePath,
        currentLayout: layout,
        updater,
      });
    }, [layout, pageLayout, replaceChildInAnotherParent, reorderChildInRow, reorderIndependentRow]);


  const onDirectionUpdateClick = async ({ snapshot, type, path }) => {
    if (type !== 'comments') return;

    const updater = (data) => {
      setLayout(data);
      updateLayout(data);
    };

    await changeChildDirection({ currentLayout: layout, updater, path, isHorizontal: snapshot.isHorizontal });

    onSnapshotDirectionUpdate({
      snapshot,
      type,
    });
  }
console.log(layout)
  const renderRow = (row, currentPath) => {
    return (
      <DashboardRow
        data={row}
        path={currentPath}
        handleDrop={handleDrop}
        handleSnapshotUpdate={handleSnapshotUpdate}
        snapshots={snapshots}
        onSnapshotDirectionUpdate={onDirectionUpdateClick}
        isPdfView={isPdfView}
        isPortfolioOwner={isPortfolioOwner}
      />
    );
  };

  return (
    <div>
      {
        layout.map((element, index) => {
          const currentPath = `${index}`;
          return (
            <React.Fragment key={element.id}>
              <DropZone
                data={{
                  path: currentPath,
                  childrenCount: pageLayout.length,
                }}
                onDrop={handleDrop}
                path={currentPath}
                acceptableItems={ACCEPTABLE_ITEMS}
              />
              {renderRow(element, currentPath)}
            </React.Fragment>
          );
        })
      }
      <DropZone
        acceptableItems={ACCEPTABLE_ITEMS}
        onDrop={handleDrop}
        isLast
        data={{
          path: `${pageLayout.length}`,
          childrenCount: pageLayout.length,
        }}
      />
    </div>
  );
};

export default DashboardDraggableList;
