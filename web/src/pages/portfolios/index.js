import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { isEmpty } from 'lodash';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { PortfolioHelmet } from '../../components/utils/Helmet';
import withLayout from '../../components/layout';
import PortfolioDashboard from '../../components/portfolios/dashboard';
import { portfoliosOperations } from '../../state/features/portfolios';

const { fetchPortfoliosOfUser } = portfoliosOperations;

const Portfolios = () => {
  const dispatch = useDispatch();
  const { auth, portfolios } = useSelector(
    (state) => ({
      auth: state.authState,
      portfolios: state.portfoliosState,
    }),
  );
  const { user: userData, token } = auth;
  const { _id: userId = '' } = userData;
  const [portfolio, setPortfolio] = useState({});

  const getUserPortfolio = useCallback(async () => {
    await dispatch(fetchPortfoliosOfUser(userId, token));
  }, [dispatch, userId, token]);

  useEffect(() => {
    getUserPortfolio();
  }, [userId, token, getUserPortfolio]);

  useEffect(() => {
    const { data, error } = portfolios;
    if (isEmpty(error) && data.portfolios.length) {
      const { portfolios: portfoliosData } = data;
      const [firstPortfolio] = portfoliosData;
      setPortfolio(firstPortfolio);
    }
  }, [portfolios]);

  const Dashboard = () => useMemo(() => <PortfolioDashboard portfolio={portfolio} isPublic={false} />, [portfolios, portfolio])

  return (
    <>
      <div className="has-background-gray-200 hero">
        <Helmet {...PortfolioHelmet} />
        <div className="hero-body pb-300 mx-25">
          <Dashboard />
        </div>
      </div>
    </>
  );
};

export default withLayout(Portfolios);
