import React from 'react';

const noChartData = ({ children }) => (
  <div className="is-flex is-flex-direction-column is-justify-content-center is-full-height is-align-items-center is-flex-wrap-wrap">
    <img src="/img/icons/no-reactions-data.svg" alt="no-reactions" />
    <p className="is-size-6 has-text-centered my-32">{children}</p>
  </div>
);

export default noChartData;
