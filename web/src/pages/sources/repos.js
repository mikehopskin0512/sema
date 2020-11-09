import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import withLayout from '../../components/layout';

const Repos = () => {
  const dispatch = useDispatch();

  // Import Redux vars
  const { auth, sources } = useSelector(
    (state) => ({
      auth: state.authState,
      sources: state.sourcesState,
    }),
  );

  return (
    <div>
      <section className="section">
        <div className="container">
          <h2 className="subtitle"><strong>Repos</strong></h2>
          <br />
        </div>
      </section>
    </div>
  );
};

export default withLayout(Repos);
