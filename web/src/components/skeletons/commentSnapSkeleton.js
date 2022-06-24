import React from "react"
import ContentLoader from "react-content-loader"

const CommentSnapSkeleton = (props) => (
  <ContentLoader
    speed={2}
    width={1232}
    height={100}
    viewBox="0 0 1232 100"
    backgroundColor="#F8F8F8"
    foregroundColor="#ecebeb"
    {...props}
  >
    <circle cx="45" cy="49" r="39" />
    <rect x="95" y="5" rx="8" ry="8" width="90" height="18" />
    <rect x="201" y="5" rx="8" ry="8" width="291" height="18" />
    <rect x="95" y="82" rx="8" ry="8" width="96" height="15" />
    <rect x="98" y="37" rx="0" ry="0" width="466" height="37" />
  </ContentLoader>
)

export default CommentSnapSkeleton;

