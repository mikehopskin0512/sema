import Link from 'next/link';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import withLayout from '../../components/layout';

import { reportsOperations } from '../../state/features/reports';

const { fetchReportList } = reportsOperations;

const Reports = () => {
  const dispatch = useDispatch();
  const spaceId = 'ff5e7381bd72';

  // Import Redux vars
  const { auth, reports } = useSelector(
    (state) => ({
      auth: state.authState,
      reports: state.reportsState,
    }),
  );

  // Get reportList from Redux state
  const { reportList = [] } = reports;

  // Fetch reports list from Mode space
  useEffect(() => {
    dispatch(fetchReportList(spaceId, auth.token));
  }, [dispatch, spaceId, auth.token]);

  const reportsStuff = reportList.map((report) => (
    <p key={report.token}><Link href={`/reports/${report.token}`}>{report.name}</Link></p>
  ));

  return (
    <div>
      <section className="section">
        <div className="container">
          <h2 className="subtitle">Reports</h2>
          {reportsStuff}
        </div>
      </section>
    </div>
  );
};

export default withLayout(Reports);
