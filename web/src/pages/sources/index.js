import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import withLayout from '../../components/layout';

import { sourcesOperations } from '../../state/features/sources';

const { createSource, fetchSources } = sourcesOperations;
const githubAppName = process.env.NEXT_PUBLIC_GITHUB_APP_NAME;

const Sources = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { query: { installation_id: sourceId, setup_action: action } } = router;

  // Import Redux vars
  const { auth, sources } = useSelector(
    (state) => ({
      auth: state.authState,
      sources: state.sourcesState,
    }),
  );

  // Get org id from user
  const { user: { organizations = [] } = {} } = auth;
  const { id: orgId } = organizations[0];

  // Post source if cb
  useEffect(() => {
    if (sourceId && action === 'install') {
      const source = {
        orgId, sourceId, type: 'github',
      };
      dispatch(createSource(source, auth.token));
    }
  }, [dispatch, orgId, sourceId, action, auth.token]);

  // Fetch sources list
  useEffect(() => {
    if (auth.token) {
      dispatch(fetchSources(orgId, auth.token));
    }
  }, [dispatch, orgId, auth.token]);

  // Get sources from state
  const { data: sourcesData = [] } = sources;
  // TEMP
  const firstSource = sourcesData[0] || {};

  return (
    <div>
      <section className="section">
        <div className="container">
          <a
            type="button"
            className="button is-fullwidth is-github"
            href={`https://github.com/apps/${githubAppName}/installations/new`}>
            <span className="icon">
              <FontAwesomeIcon icon={['fab', 'github']} />
            </span>
            <span>Add code from GitHub</span>
          </a>
          <br />
          <p>OrgId: {orgId}</p>
          <p>Connected to: {JSON.stringify(firstSource, null, 2)}</p>
        </div>
      </section>
    </div>
  );
};

export default withLayout(Sources);
