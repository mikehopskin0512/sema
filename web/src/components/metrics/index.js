import React from 'react';
import MetricsCard from './metricsCard';
import styles from "./metrics.module.scss";

export default function Metrics({ metrics, totalMetrics, isLastThirtyDays }) {
  if (!metrics || !totalMetrics) return null;

  const meta = [
    { key: 'pullRequests', title: 'pull requests', tooltip: 'Pull requests made within this repo' },
    { key: 'comments', title: 'comments', tooltip: 'Number of code review comments made on GitHub within this repo' },
    { key: 'commenters', title: 'commenters', tooltip: 'Number of users who have made comments in this organization' },
    { key: 'users', title: 'sema users', tooltip: 'Sema users who have made code review comments' },
  ];
  return (
    <>
      <div className='is-flex is-align-items-center is-justify-content-space-between'>
        <p className="has-text-black-950 has-text-weight-semibold is-size-4">Metrics</p>
        {isLastThirtyDays && <span className="is-uppercase font-size-10 has-text-gray-700 has-text-weight-semibold">
          last 30 days
        </span>}
        {/* TODO: If metrics page for organizations is added, we would activate this button */}
        {/* <button className="button is-ghost is-pulled-right has-text-weight-semibold" onClick={() => router.push('')}>View All</button> */}
      </div>
      <div className={`mt-20 pb-10 columns m-0 ${styles["metrics-container"]}`}>
        {meta.map(({ title, key, tooltip }) => <MetricsCard key={key} total={totalMetrics[key]} title={title} tooltip={tooltip} dataPoints={metrics.map(metric => metric[key])} />)}
      </div>
    </>
  );
}
