import Link from 'next/link';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import withLayout from '../../components/layout';

import { reportsOperations } from '../../state/features/reports';
import { PATHS } from '../../utils/constants';
import useAuthEffect from '../../hooks/useAuthEffect';

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
  const { token } = auth;

  // Fetch reports list from Mode space
  useAuthEffect(() => {
    dispatch(fetchReportList(spaceId, token));
  }, [spaceId]);

  // For QA of orgs
  const { user: { organizations = [] } = {} } = auth;

  const reportsStuff = reportList.map((report) => (
    <p key={report.token}><Link href={`${PATHS.REPORTS}/${report.token}`}><a title="Test report">{report.name}</a></Link></p>
  ));

  return (
    <div>
      <section className="section">
        <div className="container">
          <h2 className="subtitle"><strong>Static reports</strong></h2>
          <p><Link href={`${PATHS.REPORTS}/${testReportId}`}><a title="Test report">Test report (use this)</a></Link></p>
          <br />
          <h2 className="subtitle"><strong>Dynamic reports from Mode</strong></h2>
          {reportsStuff}
          <br /><br />
          <p>Organizations QA: {JSON.stringify(organizations[0], null, 2)}</p>
        </div>
      </section>
    </div>
  );
};

export default withLayout(Reports);
