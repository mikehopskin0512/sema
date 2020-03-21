import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import withLayout from '../../components/layout';
import ReportsHeader from '../../components/reports/reportsHeader';

import { reportsOperations } from '../../state/features/reports';
import { organizationsOperations } from '../../state/features/organizations';

const { fetchReportUrl } = reportsOperations;
const { updateFilters } = organizationsOperations;

// Hard code reportId
const reportId = '43e7fa173112';

const buildFilterUrl = (params) => _.map(params, (value, param) => {
  if (_.isArray(value)) {
    if (value.length > 0) {
      // Array with values
      const paramValues = _.map(value, (item) => `%5B%5D=${encodeURIComponent(item)}`).join('&');
      return `${param}=${paramValues}`;
    }
    // Array empty values
    return `${param}=all`;
  }
  // String
  return `${param}=${value}`;
}).join('&');

const Reports = () => {
  const reportFrame = useRef(null);
  const dispatch = useDispatch();

  // Import Redux vars
  const { auth, reports, organizations } = useSelector(
    (state) => ({
      auth: state.authState,
      reports: state.reportsState,
      organizations: state.organizationsState,
    }),
  );

  // Get filters from Redux
  const { filters } = organizations;

  // Declare local state var for report filterUrl
  const [filterUrl, setFilterUrl] = useState(buildFilterUrl(filters));

  const handleUpdateFilters = (paramType, paramList) => {
    const newFilters = {
      ...filters,
      [paramType]: paramList,
    };
    dispatch(updateFilters(newFilters));
  };

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
      <ReportsHeader updateFilters={handleUpdateFilters} />
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
