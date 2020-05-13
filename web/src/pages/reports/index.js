import Link from 'next/link';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import withLayout from '../../components/layout';

import { reportsOperations } from '../../state/features/reports';

const { fetchReportList } = reportsOperations;

const Reports = () => {
  const dispatch = useDispatch();
  const spaceId = '7290098a6c1c';
  const testReportId = '43e7fa173112';

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
          <h2 className="subtitle">Static reports</h2>
          <p><Link href={`/reports/${testReportId}`}>Test report (use this)</Link></p>
          <br />
          <h2 className="subtitle">Dynamic reports from Mode</h2>
          {reportsStuff}
        </div>
      </section>
    </div>
  );
};

export default withLayout(Reports);
