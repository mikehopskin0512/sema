import React from "react"
import ContentLoader from "react-content-loader"

const DiagramChartSkeleton = (props) => (
  <ContentLoader
    speed={2}
    width="100%"
    height={382}
    viewBox="0 0 624 328"
    backgroundColor="#d3d7d9"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="475" y="1" rx="0" ry="0" width="144" height="42" />
    <rect x="1" y="1" rx="0" ry="0" width="144" height="42" />
    <circle cx="283" cy="186" r="63" />
    <circle cx="406" cy="159" r="52" />
    <circle cx="372" cy="244" r="31" />
    <circle cx="293" cy="288" r="39" />
    <circle cx="207" cy="276" r="25" />
    <circle cx="170" cy="196" r="38" />
    <circle cx="262" cy="83" r="38" />
    <circle cx="196" cy="129" r="25" />
    <circle cx="332" cy="102" r="24" />
  </ContentLoader>
)

export default DiagramChartSkeleton

