import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { PortfolioHelmet } from '../../../components/utils/Helmet';
import withLayout from '../../../components/layout';
import PortfolioDashboard from '../../../components/portfolios/dashboard';
import { portfoliosOperations } from '../../../state/features/portfolios';
import { savePdfDocument } from '../../../utils';

const { fetchPortfolio } = portfoliosOperations;

const PublicPortfolio = () => {
  const router = useRouter();
  const {
    query: { portfolioId },
  } = router;
  const portfolioRef = useRef(null);
  const dispatch = useDispatch();
  const { token, portfolios, publicPortfolio, isLoading } = useSelector(
    (state) => ({
      token: state.authState.token,
      portfolios: state.portfoliosState.data.portfolios,
      publicPortfolio: state.portfoliosState.data.portfolio,
      isLoading: state.portfoliosState.isFetching
    }),
  );

  useEffect(() => {
    dispatch(fetchPortfolio(portfolioId));
  }, [portfolioId, dispatch, token]);

  const portfolio = portfolios.find(({ _id }) => _id === portfolioId) || publicPortfolio;

  return (
    <div className="has-background-white hero">
      <Helmet {...PortfolioHelmet} />
      <div className="hero-body pb-300 mx-25" ref={portfolioRef}>
        {portfolio && (
          <PortfolioDashboard
            portfolio={portfolio}
            isIndividualView
            isLoading={isLoading}
            printDocument={() => savePdfDocument(portfolioRef)}
          />
        )}
      </div>
    </div>
  );
};

export default withLayout(PublicPortfolio);
