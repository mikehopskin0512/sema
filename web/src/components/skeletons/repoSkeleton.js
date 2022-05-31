import React from "react"
import ContentLoader from "react-content-loader"

const RepoSkeleton = (props) => (
  <ContentLoader
    speed={2}
    width={420}
    height={157}
    viewBox="0 0 420 157"
    backgroundColor="#d3d7d9"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="0" y="0" rx="8" ry="8" width="420" height="11" />
    <rect x="10" y="55" rx="8" ry="8" width="143" height="21" />
    <rect x="10" y="93" rx="8" ry="8" width="243" height="17" />
    <rect x="10" y="129" rx="8" ry="8" width="191" height="17" />
  </ContentLoader>
)

export default RepoSkeleton

