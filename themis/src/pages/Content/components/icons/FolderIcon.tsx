import React from 'react';

type FolderIconType = {
  className?: string;
};

export const FolderIcon = ({ className }: FolderIconType) => {
  return (
    <svg
      width="24"
      height="24"
      className={className ?? ''}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.404 7.59709H10.7993C10.6908 7.59688 10.5871 7.55268 10.5119 7.47462L9.43841 6.36352C9.21138 6.12879 8.89883 5.9962 8.57227 5.99609H5.82496C5.03604 5.99698 4.39659 6.63607 4.39526 7.42499V16.5747C4.39659 17.3636 5.03604 18.0027 5.82496 18.0036H18.1751C18.964 18.0027 19.6034 17.3636 19.6048 16.5747V8.79784C19.6048 8.13469 19.0672 7.59709 18.404 7.59709Z"
        fill="#5E6871"
      />
      <mask
        id="mask0_14153_5826"
        maskUnits="userSpaceOnUse"
        x="4"
        y="5"
        width="16"
        height="14"
      >
        <path
          d="M18.404 7.59709H10.7993C10.6908 7.59688 10.5871 7.55268 10.5119 7.47462L9.43841 6.36352C9.21138 6.12879 8.89883 5.9962 8.57227 5.99609H5.82496C5.03604 5.99698 4.39659 6.63607 4.39526 7.42499V16.5747C4.39659 17.3636 5.03604 18.0027 5.82496 18.0036H18.1751C18.964 18.0027 19.6034 17.3636 19.6048 16.5747V8.79784C19.6048 8.13469 19.0672 7.59709 18.404 7.59709Z"
          fill="white"
        />
      </mask>
    </svg>
  );
};