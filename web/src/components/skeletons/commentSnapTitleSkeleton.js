import React from 'react';
import ContentLoader from 'react-content-loader';

export const CommentSnapTitleSkeleton = (props) => {
  return (
    <ContentLoader
      speed={2}
      width={1272}
      height={65}
      viewBox="0 0 1272 65"
      backgroundColor="#d3d7d9"
      foregroundColor="#ecebeb"
      {...props}
    >
      <rect x="10" y="19" rx="8" ry="8" width="276" height="42" />
      <rect x="305" y="20" rx="8" ry="8" width="93" height="42" />
    </ContentLoader>
  );
};


