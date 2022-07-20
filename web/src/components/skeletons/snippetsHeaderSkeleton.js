import React from "react"
import ContentLoader from "react-content-loader"

const SnippetsHeaderSkeleton = (props) => (
  <ContentLoader
    speed={2}
    width={420}
    height={110}
    viewBox="0 0 100% 100%"
    backgroundColor="#d3d7d9"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="1" y="21" rx="8" ry="8" width="420" height="20" />
    <rect x="1" y="64" rx="8" ry="8" width="277" height="14" />
  </ContentLoader>
)

export default SnippetsHeaderSkeleton

