import React from "react"
import ContentLoader from "react-content-loader"

const RepoSkeleton = (props) => (
  <ContentLoader
    speed={2}
    width="100%"
    height={170}
    viewBox="0 0 100% 100%"
    backgroundColor="#d3d7d9"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="7%" y="47" rx="0" ry="0" width="86%" height="30" />
    <rect x="7%" y="89" rx="0" ry="0" width="70%" height="24" />
    <rect x="7%" y="145" rx="0" ry="0" width="70" height="21" />
  </ContentLoader>
)

export default RepoSkeleton

