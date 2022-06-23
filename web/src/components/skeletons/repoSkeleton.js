import React from "react"
import ContentLoader from "react-content-loader"

const RepoSkeleton = (props) => (
  <ContentLoader
    speed={2}
    width="100%"
    height={190}
    viewBox="0 0 100% 190"
    backgroundColor="#d3d7d9"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="0" y="0" rx="0" ry="0" width="100%" height="60" />
    <rect x="5%" y="70" rx="8" ry="8" width="20%" height="110" />
    <rect x="27%" y="70" rx="8" ry="8" width="20%" height="110" />
    <rect x="50%" y="70" rx="8" ry="8" width="20%" height="110" />
    <rect x="75%" y="70" rx="8" ry="8" width="20%" height="110" />
  </ContentLoader>
)

export default RepoSkeleton

