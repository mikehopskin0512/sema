import { useSelector, useDispatch } from 'react-redux';

import withLayout from '../components/layout';

const Reports = () => {
  const dispatch = useDispatch();

  const { auth } = useSelector(
    (state) => ({
      auth: state.authState,
    }),
  );
  
  return (<p>This is the reports page.</p>);
};

export default withLayout(Reports);
