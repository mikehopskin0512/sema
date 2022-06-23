import React from "react"
import ContentLoader from "react-content-loader"

const LineChartSkeleton = (props) => (
  <ContentLoader
    speed={2}
    width="100%"
    height={462}
    viewBox="0 0 624 408"
    backgroundColor="#d3d7d9"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="395" y="1" rx="0" ry="0" width="214" height="37" />
    <rect x="60" y="179" rx="0" ry="0" width="50" height="379" />
    <rect x="135" y="255" rx="0" ry="0" width="50" height="302" />
    <rect x="210" y="95" rx="0" ry="0" width="50" height="462" />
    <rect x="285" y="185" rx="0" ry="0" width="50" height="373" />
    <rect x="360" y="121" rx="0" ry="0" width="50" height="447" />
    <rect x="435" y="178" rx="0" ry="0" width="50" height="380" />
    <rect x="510" y="196" rx="0" ry="0" width="50" height="362" />
  </ContentLoader>
)

export default LineChartSkeleton

