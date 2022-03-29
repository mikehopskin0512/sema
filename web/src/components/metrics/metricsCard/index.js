import React from 'react'
import clsx from 'clsx'
import styles from './metricsCard.module.scss'
import { ResponsiveLine } from "@nivo/line";
import data from "../../LineChart/data";
import Tooltip from '../../Tooltip';
import { InfoOutlineIcon } from '../../Icons';
import { blue700, gray100 } from "../../../../styles/_colors.module.scss";

const MetricsCard = ({
  title,
  tooltip,
  dataPoints,
}) => {
  const firstPoint = dataPoints[0];
  const lastPoint = dataPoints[dataPoints.length - 1];
  const multiplier = lastPoint >= firstPoint ? 1 : -1;
  const pointsDifference = lastPoint / firstPoint;
  let differenceInPercentage = Math.round(
    multiplier * Math.abs(1 - pointsDifference) * 100
  );
  if (lastPoint === 0) {
    differenceInPercentage = 0;    
  } else if (firstPoint === 0) {
    differenceInPercentage = 100;
  }
  return (
    <>
      <div
        className={clsx(
          "column is-flex is-flex-direction-column is-align-items-stretch py-20 border-radius-4px",
          styles["card"]
        )}
      >
        <div className={clsx("is-size-7", styles["card-title"])}>
          <span className="mr-8 is-uppercase has-text-weight-medium">
            {title}
          </span>
          <Tooltip text={tooltip}>
            <InfoOutlineIcon size="small" />
          </Tooltip>
          <span className="ml-auto has-text-weight-semibold has-text-blue-700">
            {differenceInPercentage}%
          </span>
        </div>
        <div
          className={clsx(
            "is-size-3 has-text-weight-semibold has-text-black-900",
            styles["card-subtitle"]
          )}
        >
          {lastPoint}
          <div className={styles.chart}>
            <ResponsiveLine
              curve="monotoneX"
              data={[
                {
                  id: "last-30-days",
                  data: dataPoints.map((point, index) => ({
                    x: index,
                    y: point,
                  })),
                },
              ]}
              yScale={{
                type: "linear",
              }}
              colors={blue700}
              defs={[
                {
                  id: "areaGradient",
                  type: "linearGradient",
                  colors: [{ offset: 100, color: gray100 }],
                },
              ]}
              areaOpacity={1}
              fill={[{ match: "*", id: "areaGradient" }]}
              enableArea={true}
              enablePoints={false}
              enableGridX={false}
              enableGridY={false}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MetricsCard;