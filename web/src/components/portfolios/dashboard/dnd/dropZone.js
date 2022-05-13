import React from "react";
import { useDrop } from "react-dnd";
import clsx from "clsx";

const DropZone = ({ data, onDrop, isLast, className, acceptableItems }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: acceptableItems,
    drop: (item) => {
      onDrop(data, item);
    },
    canDrop: (item) => {
      const itemPath = item.path;
      if (!itemPath) return false;
      const isHorizontalItem = item?.data?.isHorizontal ?? false;
      const isNewRowDropzone = data.path?.split('-')?.length === 1;
      const isSamePath = (data.path === item.path?.split('-')?.[0]);

      if (!isHorizontalItem) return isSamePath || !!item.path;

      return isHorizontalItem && isNewRowDropzone;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  const isActive = isOver && canDrop;
  return (
    <div
      className={clsx(
        "dropZone",
        { active: isActive, isLast },
        className
      )}
      ref={drop}
    />
  );
};

export default DropZone;
