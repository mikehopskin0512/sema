import Link from 'next/link';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import withLayout from '../../components/layout';

import { reportsOperations } from '../../state/features/reports';

const { fetchReportList } = reportsOperations;

const Reports = () => {
  const dispatch = useDispatch();
  const spaceId = '9d149b7e7667';
  const testReportId = '7171e890b648';

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
    <p key={report.token}><Link href={`/reports/${report.token}`}><a title="Test report">{report.name}</a></Link></p>
  ));

  return (
    <div>
      <section className="section">
        <div className="container">
          <h2 className="subtitle">Static reports</h2>
          <p><Link href={`/reports/${testReportId}`}><a title="Test report">Test report (use this)</a></Link></p>
          <br />
          <h2 className="subtitle">Dynamic reports from Mode</h2>
          {reportsStuff}
        </div>
      </section>
    </div>
  );
};

export default withLayout(Reports);
