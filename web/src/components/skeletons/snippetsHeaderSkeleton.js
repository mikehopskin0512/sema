import React from "react"
import ContentLoader from "react-content-loader"

const SnippetsHeaderSkeleton = (props) => (
  <ContentLoader
    speed={2}
    width={595}
    height={140}
    viewBox="0 0 100% 100%"
    backgroundColor="#d3d7d9"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="1" y="2" rx="8" ry="8" width="595" height="42" />
    <rect x="1" y="64" rx="8" ry="8" width="278" height="30" />
  </ContentLoader>
)

export default SnippetsHeaderSkeleton

