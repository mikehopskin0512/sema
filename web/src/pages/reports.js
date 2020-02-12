import { useSelector, useDispatch } from 'react-redux';

import withLayout from '../components/layout';
import { withAuthSync } from '../utils/auth';

const Reports = () => {
  const dispatch = useDispatch();

  const { auth } = useSelector(
    (state) => ({
      auth: state.auth,
    }),
  );

  console.log(auth);

  return (<p>This is the reports page.</p>);
};

export default withAuthSync(withLayout(Reports));
