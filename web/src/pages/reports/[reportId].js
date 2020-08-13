import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import _ from 'lodash';
import withLayout from '../../components/layout';
import ReportsHeader from '../../components/reports/reportsHeader';

import { reportsOperations } from '../../state/features/reports';
import { organizationsOperations } from '../../state/features/organizations';

const { fetchReportUrl } = reportsOperations;
const { updateFilters } = organizationsOperations;

const buildFilterUrl = (params) => _.map(params, (value, param) => {
  if (_.isArray(value)) {
    if (value.length > 0) {
      // Array with values
      const paramValues = _.map(value, (item) => `${param}%5B%5D=${encodeURIComponent(item)}`).join('&');
      return paramValues;
    }
    // Array empty values
    return `${param}=all`;
  }
  // String
  return `${param}=${value}`;
}).join('&');

const Report = () => {
  // Get reportId from route
  const router = useRouter();
  const { reportId } = router.query;

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

  // Get filters and user.orgId from Redux
  const { currentFilters } = organizations;
  const { user: { orgId } } = auth;

  // Declare local state var for report filterUrl
  const [filterUrl, setFilterUrl] = useState(buildFilterUrl(currentFilters));

  const handleUpdateFilters = (paramType, paramList) => {
    const newFilters = {
      ...currentFilters,
      [paramType]: paramList,
    };
    dispatch(updateFilters(newFilters));
  };

  // Update report url when currentFilters change
  useEffect(() => {
    setFilterUrl(buildFilterUrl(currentFilters));
  }, [currentFilters]);

  // Get mode Url from reports endpoint
  useEffect(() => {
    dispatch(fetchReportUrl(reportId, orgId, filterUrl, auth.token));
  }, [reportId, orgId, dispatch, filterUrl, auth.token]);

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

export default withLayout(Report);
