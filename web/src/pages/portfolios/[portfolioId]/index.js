import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { Helmet } from 'react-helmet';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { PortfolioHelmet } from '../../../components/utils/Helmet';
import withLayout from '../../../components/layout';
import PortfolioDashboard from '../../../components/portfolios/dashboard';
import { portfoliosOperations } from '../../../state/features/portfolios';

const { fetchPortfolio } = portfoliosOperations;

const PublicPortfolio = () => {
  const router = useRouter();
  const {
    query: { portfolioId },
  } = router;
  const dispatch = useDispatch();
  const { auth, portfolios } = useSelector(
    (state) => ({
      auth: state.authState,
      portfolios: state.portfoliosState,
    }),
  );
  const { token } = auth;
  const [portfolio, setPortfolio] = useState({});

  useEffect(() => {
    dispatch(fetchPortfolio(portfolioId));
  }, [portfolioId, dispatch, token]);

  useEffect(() => {
    const { data, error } = portfolios;
    if (isEmpty(error) && !isEmpty(data.portfolio)) {
      const { portfolio: portfolioData } = data;
      setPortfolio(portfolioData);
    }
  }, [portfolios]);

  return (
    <>
      <div className="has-background-gray-200 hero">
        <Helmet {...PortfolioHelmet} />
        <PortfolioDashboard portfolio={portfolio} isPublic />
      </div>
    </>
  );
};

export default withLayout(PublicPortfolio);
