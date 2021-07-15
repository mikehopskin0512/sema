import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../../components/sidebar'
import withLayout from '../../components/layout';
import { repositoriesOperations } from '../../state/features/repositories';

const { fetchRepo } = repositoriesOperations;

const Stats = () => {
  const dispatch = useDispatch();

  const { auth, repositories } = useSelector((state) => ({
    repositories: state.repositoriesState,
    auth: state.authState,

  }));
  const { token } = auth;


  useEffect(() => {
    (async () => {
      await dispatch(fetchRepo('60ef2137075eb50855548b39', token));
    })();
  }, []);
  console.log(repositories);

  return (
    <Sidebar>
      Test
    </Sidebar>
  )
}

export default withLayout(Stats);

