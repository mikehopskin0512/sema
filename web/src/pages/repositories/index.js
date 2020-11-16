import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Toaster from '../../components/toaster';
import withLayout from '../../components/layout';
import { alertOperations } from '../../state/features/alerts';
import { repositoriesOperations } from '../../state/features/repositories';

const { clearAlert } = alertOperations;
const { fetchRepos } = repositoriesOperations;

const Repos = () => {
  const dispatch = useDispatch();

  // Import Redux vars
  const { alerts, auth, repositories } = useSelector(
    (state) => ({
      alerts: state.alertsState,
      auth: state.authState,
      repositories: state.repositoriesState,
    }),
  );

  // Get org id from user
  const { user: { organizations = [] } = {} } = auth;
  const { id: orgId } = organizations[0];

  // Show alerts from state
  const { showAlert, alertType, alertLabel } = alerts;
  useEffect(() => {
    if (showAlert === true) {
      dispatch(clearAlert());
    }
  }, [showAlert, dispatch]);

  // Fetch repos
  useEffect(() => {
    if (auth.token) {
      dispatch(fetchRepos(orgId, auth.token));
    }
  }, [dispatch, orgId, auth.token]);

  // Get repositories from state
  const { data: repositoriesList = [] } = repositories;
  const debug = repositoriesList.map((item) => <span key={item._id}>{item.name}<br /></span>);

  return (
    <div>
      <Toaster
        type={alertType}
        message={alertLabel}
        showAlert={showAlert} />
      <section className="section">
        <div className="container">
          <h2 className="subtitle"><strong>Repos</strong></h2>
          <br />
          <p>{debug}</p>
        </div>
      </section>
    </div>
  );
};

export default withLayout(Repos);
