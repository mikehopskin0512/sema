import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import withLayout from '../../components/layout';
import ReportsHeader from '../../components/reports/reportsHeader';

import { reportsOperations } from '../../state/features/reports';

const { fetchReportUrl } = reportsOperations;

// Hard code reportId
const reportId = '43e7fa173112';

const buildFilterUrl = (params) => _.map(params, (value, param) => `${param}${value}`).join('&');

const Reports = () => {
  const reportFrame = useRef(null);
  const dispatch = useDispatch();
  // Declare local state var for report filters
  const [filters, setFilters] = useState(initialFilters);
  const [filterUrl, setFilterUrl] = useState(buildFilterUrl(filters));

  // Import Redux vars
  const { auth, reports } = useSelector(
    (state) => ({
      auth: state.authState,
      reports: state.reportsState,
    }),
  );

  const updateFilters = (paramType, paramList) => {
    setFilters(
      {
        ...filters,
        [paramType]: paramList,
      },
    );
  };

  useEffect(() => {
    const messageOptions = {
      type: 'reportFilterPanelDisplay',
      wleFilterPanelToggle: true,
    };

    reportFrame.current.contentWindow.postMessage(messageOptions, '*');
  }, []);

  // Update report url when filters change
  useEffect(() => {
    setFilterUrl(buildFilterUrl(filters));
  }, [filters]);

  // Get mode Url from embedded_bi endpoint
  useEffect(() => {
    dispatch(fetchReportUrl(reportId, filterUrl, auth.token));
  }, [dispatch, filterUrl, auth.token]);

  const { reportUrl } = reports;

  return (
    <div>
      <ReportsHeader updateFilters={updateFilters} />
      <section className="section">
        <div className="container">
          <h2 className="subtitle">
            <figure className="image is-16by9">
              <iframe
                className="has-ratio"
                ref={reportFrame}
                key={reportUrl}
                src={reportUrl}
                title="Report frame"
                frameBorder="0"
                allowFullScreen />
            </figure>
          </h2>
          <p>Debug: {reportUrl}</p>
        </div>
      </section>
    </div>
  );
};

export default withLayout(Reports);
