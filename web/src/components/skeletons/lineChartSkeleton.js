import React from "react"
import ContentLoader from "react-content-loader"

const LineChartSkeleton = (props) => (
  <ContentLoader
    speed={2}
    width="100%"
    height={382}
    viewBox="0 0 624 382"
    backgroundColor="#d3d7d9"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="5" y="17" rx="0" ry="0" width="144" height="42" />
    <rect x="449" y="15" rx="0" ry="0" width="144" height="42" />
    <rect x="3" y="236" rx="0" ry="0" width="43" height="144" />
    <rect x="244" y="239" rx="0" ry="0" width="43" height="144" />
    <rect x="324" y="241" rx="0" ry="0" width="43" height="144" />
    <rect x="404" y="241" rx="0" ry="0" width="43" height="144" />
    <rect x="481" y="241" rx="0" ry="0" width="43" height="144" />
    <rect x="555" y="238" rx="0" ry="0" width="43" height="144" />
    <rect x="84" y="236" rx="0" ry="0" width="43" height="144" />
    <rect x="163" y="237" rx="0" ry="0" width="43" height="144" />
  </ContentLoader>
)

export default LineChartSkeleton

