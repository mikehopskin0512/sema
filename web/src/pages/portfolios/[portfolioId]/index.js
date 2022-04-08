import React, { useEffect } from 'react';
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
  const { token, portfolios } = useSelector(
    (state) => ({
      token: state.authState.token,
      portfolios: state.portfoliosState.data.portfolios,
    }),
  );
  const portfolio = portfolios.find(({ _id }) => _id === portfolioId);
  useEffect(() => {
    dispatch(fetchPortfolio(portfolioId));
  }, [portfolioId, dispatch, token]);

  return (
    <div className="has-background-gray-200 hero">
      <Helmet {...PortfolioHelmet} />
      <div className="hero-body pb-300 mx-25">
        {portfolio && (
          <PortfolioDashboard
            portfolio={portfolio}
            isIndividualView
            isLoading={portfolios.isFetching}
          />
        )}
      </div>
    </div>
  );
};

export default withLayout(PublicPortfolio);
