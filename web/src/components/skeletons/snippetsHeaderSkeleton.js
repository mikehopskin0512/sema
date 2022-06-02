import React from "react"
import ContentLoader from "react-content-loader"

const SnippetsHeaderSkeleton = (props) => (
  <ContentLoader
    speed={2}
    width={420}
    height={172}
    viewBox="0 0 420 157"
    backgroundColor="#d3d7d9"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="1" y="11" rx="8" ry="8" width="420" height="42" />
    <rect x="1" y="76" rx="8" ry="8" width="277" height="30" />
  </ContentLoader>
)

export default SnippetsHeaderSkeleton

