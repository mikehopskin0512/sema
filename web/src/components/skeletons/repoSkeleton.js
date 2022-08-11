import React from "react"
import ContentLoader from "react-content-loader"

const RepoSkeleton = (props) => (
  <ContentLoader
    speed={2}
    width="100%"
    height={157}
    viewBox="0 0 100% 100%"
    backgroundColor="#d3d7d9"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="0" y="0" rx="0" ry="0" width="100%" height="11" />
    <rect x="4%" y="30" rx="8" ry="8" width="35%" height="21" />
    <rect x="4%" y="62" rx="8" ry="8" width="65%" height="17" />
    <rect x="4%" y="89" rx="8" ry="8" width="45%" height="17" />
  </ContentLoader>
)

export default RepoSkeleton

