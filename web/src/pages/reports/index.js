import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import withLayout from '../../components/layout';
import ReportsHeader from './reportsHeader';

import { reportsOperations } from '../../state/features/reports';

const { getModeUrl } = reportsOperations;

const Reports = () => {
  const dispatch = useDispatch();

  // Import state vars
  const { auth, reports } = useSelector(
    (state) => ({
      auth: state.authState,
      reports: state.reportState,
    }),
  );

  // Get mode Url from embedded_bi endpoint
  useEffect(() => {
    dispatch(getModeUrl(auth.token));
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
