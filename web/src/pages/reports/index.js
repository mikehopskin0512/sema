import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import withLayout from '../../components/layout';
import ReportsHeader from '../../components/reports/reportsHeader';

import { reportsOperations } from '../../state/features/reports';

const { fetchReportUrl } = reportsOperations;

const initialFilters = {
  param_z_date_end: '2018-10-31',
  param_z_date_start: '2018-04-01',
  param_z_developers: 'all',
  param_z_filetypes: 'all',
  param_z_projects: 'all',
};

const buildFilterUrl = (params) => Object.keys(params).map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');

const Reports = () => {
  const dispatch = useDispatch();
  // Declare local state var for report filters
  // const [state, dispatch] = useReducer(counterReducer, initialState);
  const [filters, setFilters] = useState(initialFilters);
  const [filterUrl, setFilterUrl] = useState(buildFilterUrl(filters));

  // Import state vars
  const { auth, reports } = useSelector(
    (state) => ({
      auth: state.authState,
      reports: state.reportState,
    }),
  );

  // Get mode Url from embedded_bi endpoint
  useEffect(() => {
    dispatch(fetchReportUrl(auth.token));
  }, [dispatch, auth.token]);

  const { reportUrl } = reports;

  return (
    <div>
      <ReportsHeader />
      <section className="section">
        <div className="container">
          <h1 className="title">Report Title</h1>
          <h2 className="subtitle">
            <figure className="image is-16by9">
              <iframe className="has-ratio" src={reportUrl} frameBorder="0" allowFullScreen />
            </figure>
          </h2>
        </div>
      </section>
    </div>
  );
};

export default withLayout(Reports);
