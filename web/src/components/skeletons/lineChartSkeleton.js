import React from "react"
import ContentLoader from "react-content-loader"

const LineChartSkeleton = (props) => (
  <ContentLoader
    speed={2}
    width="100%"
    height={382}
    viewBox="0 0 624 328"
    backgroundColor="#d3d7d9"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="475" y="0" rx="0" ry="0" width="144" height="42" />
    <rect x="5" y="209" rx="0" ry="0" width="43" height="119" />
    <rect x="247" y="125" rx="0" ry="0" width="43" height="202" />
    <rect x="327" y="215" rx="0" ry="0" width="43" height="113" />
    <rect x="407" y="151" rx="0" ry="0" width="43" height="177" />
    <rect x="482" y="208" rx="0" ry="0" width="43" height="120" />
    <rect x="558" y="226" rx="0" ry="0" width="43" height="102" />
    <rect x="162" y="285" rx="0" ry="0" width="43" height="42" />
    <rect x="0" y="0" rx="0" ry="0" width="144" height="42" />
    <rect x="80" y="137" rx="0" ry="0" width="43" height="192" />
  </ContentLoader>
)

export default LineChartSkeleton

